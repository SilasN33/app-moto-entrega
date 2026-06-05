import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardDivider } from "@/components/ui/Card";
import { PageHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const prev = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1),
    "yyyy-MM",
  );
  const next = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1),
    "yyyy-MM",
  );

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Fechamento"
        title="Relatório mensal"
        action={
          <div className="flex items-center gap-1 rounded-lg border border-line bg-paper p-1">
            <Link
              href={`/admin/relatorio?month=${prev}`}
              className="rounded-md p-1 text-ink-3 hover:bg-paper-2 hover:text-ink"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="px-2 text-[13px] font-medium capitalize text-ink">
              {format(monthDate, "MMMM/yyyy", { locale: ptBR })}
            </span>
            <Link
              href={`/admin/relatorio?month=${next}`}
              className="rounded-md p-1 text-ink-3 hover:bg-paper-2 hover:text-ink"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      <Card>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-4">
          Resumo do mês
        </p>
        <div className="mt-3 space-y-1.5">
          <ReportRow label="Bruto" value={formatBRL(totalGross)} />
          <ReportRow
            label="Descontos"
            value={`− ${formatBRL(totalDeductions)}`}
            tone="muted"
          />
          <CardDivider />
          <ReportRow
            label="Total a pagar"
            value={formatBRL(totalNet)}
            tone="emphasis"
            big
          />
        </div>
      </Card>

      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-medium text-ink">{r.name}</p>
              <span className="font-mono text-[16px] font-semibold text-ember">
                {formatBRL(r.net)}
              </span>
            </div>
            <hr className="divider-dashed -mx-4 my-2.5" />
            <div className="grid grid-cols-3 text-[12px]">
              <span className="text-ink-3">
                {r.deliveries} entregas
              </span>
              <span className="text-center font-mono text-ink-3">
                {formatBRL(r.gross)}
              </span>
              <span className="text-right font-mono text-ink-4">
                − {formatBRL(r.deductions)}
              </span>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <Card className="py-10 text-center text-[13px] text-ink-3">
            Nenhum motoboy ainda.
          </Card>
        )}
      </div>
    </div>
  );
}

function ReportRow({
  label,
  value,
  tone = "default",
  big,
}: {
  label: string;
  value: string;
  tone?: "default" | "muted" | "emphasis";
  big?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`${big ? "text-[13px]" : "text-[13px]"} ${tone === "emphasis" ? "font-medium text-ink" : "text-ink-3"}`}
      >
        {label}
      </span>
      <span
        className={`font-mono ${big ? "text-[20px]" : "text-[14px]"} ${
          tone === "emphasis"
            ? "font-semibold text-ember"
            : tone === "muted"
              ? "text-ink-3"
              : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
