import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { formatBRL } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface MotoboyTotal {
  id: string;
  name: string;
  deliveries: number;
  gross: number;
  deductions: number;
  net: number;
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const sp = await searchParams;
  const monthParam = sp.month ?? format(new Date(), "yyyy-MM");
  const monthDate = parse(monthParam, "yyyy-MM", new Date());
  const start = startOfMonth(monthDate).toISOString();
  const end = endOfMonth(monthDate).toISOString();

  const [{ data: motoboys }, { data: orders }, { data: deductions }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "motoboy")
        .order("full_name"),
      supabase
        .from("orders")
        .select("motoboy_id, amount, status, delivered_at")
        .eq("status", "delivered")
        .gte("delivered_at", start)
        .lte("delivered_at", end),
      supabase
        .from("deductions")
        .select("motoboy_id, amount, ref_date")
        .gte("ref_date", format(monthDate, "yyyy-MM-01"))
        .lte("ref_date", format(endOfMonth(monthDate), "yyyy-MM-dd")),
    ]);

  const totals: Record<string, MotoboyTotal> = {};
  for (const m of motoboys ?? []) {
    totals[m.id] = {
      id: m.id,
      name: m.full_name,
      deliveries: 0,
      gross: 0,
      deductions: 0,
      net: 0,
    };
  }
  for (const o of orders ?? []) {
    if (!o.motoboy_id || !totals[o.motoboy_id]) continue;
    totals[o.motoboy_id].deliveries += 1;
    totals[o.motoboy_id].gross += Number(o.amount);
  }
  for (const d of deductions ?? []) {
    if (!totals[d.motoboy_id]) continue;
    totals[d.motoboy_id].deductions += Number(d.amount);
  }
  for (const id of Object.keys(totals)) {
    totals[id].net = totals[id].gross - totals[id].deductions;
  }

  const rows = Object.values(totals).sort((a, b) => b.net - a.net);
  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalDeductions = rows.reduce((s, r) => s + r.deductions, 0);
  const totalNet = totalGross - totalDeductions;

  // mês anterior / próximo
  const prev = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1),
    "yyyy-MM"
  );
  const next = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1),
    "yyyy-MM"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Relatório mensal</h2>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/admin/relatorio?month=${prev}`}
            className="rounded-lg bg-neutral-100 px-2 py-1"
          >
            ←
          </Link>
          <span className="font-medium">
            {format(monthDate, "MMMM/yyyy", { locale: ptBR })}
          </span>
          <Link
            href={`/admin/relatorio?month=${next}`}
            className="rounded-lg bg-neutral-100 px-2 py-1"
          >
            →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-xs text-neutral-500">Bruto</p>
          <p className="text-base font-bold">{formatBRL(totalGross)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral-500">Descontos</p>
          <p className="text-base font-bold text-red-600">
            − {formatBRL(totalDeductions)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral-500">A pagar</p>
          <p className="text-base font-bold text-green-700">
            {formatBRL(totalNet)}
          </p>
        </Card>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{r.name}</p>
              <span className="font-bold text-green-700">
                {formatBRL(r.net)}
              </span>
            </div>
            <div className="grid grid-cols-3 text-xs text-neutral-500">
              <span>{r.deliveries} entregas</span>
              <span>Bruto {formatBRL(r.gross)}</span>
              <span className="text-right text-red-600">
                − {formatBRL(r.deductions)}
              </span>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum motoboy ainda.
          </Card>
        )}
      </div>
    </div>
  );
}
