import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { formatBRL, formatPhoneBR } from "@/lib/utils";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const me = await requireMotoboy();
  const supabase = await createClient();

  const monthStart = startOfMonth(new Date()).toISOString();
  const monthEnd = endOfMonth(new Date()).toISOString();

  const [{ data: delivered }, { data: deductions }] = await Promise.all([
    supabase
      .from("orders")
      .select("amount")
      .eq("motoboy_id", me.id)
      .eq("status", "delivered")
      .gte("delivered_at", monthStart)
      .lte("delivered_at", monthEnd),
    supabase
      .from("deductions")
      .select("amount")
      .eq("motoboy_id", me.id)
      .gte("ref_date", monthStart.slice(0, 10))
      .lte("ref_date", monthEnd.slice(0, 10)),
  ]);

  const gross = (delivered ?? []).reduce((s, o) => s + Number(o.amount), 0);
  const ded = (deductions ?? []).reduce((s, d) => s + Number(d.amount), 0);
  const net = gross - ded;

  return (
    <div className="space-y-4">
      <Card className="space-y-1">
        <p className="text-base font-bold">{me.full_name}</p>
        {me.phone && (
          <p className="text-sm text-neutral-500">{formatPhoneBR(me.phone)}</p>
        )}
        {me.email && <p className="text-sm text-neutral-500">{me.email}</p>}
      </Card>

      <h2 className="text-base font-semibold">Resumo do mês</h2>
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-xs text-neutral-500">Bruto</p>
          <p className="font-bold">{formatBRL(gross)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral-500">Descontos</p>
          <p className="font-bold text-red-600">− {formatBRL(ded)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-neutral-500">A receber</p>
          <p className="font-bold text-green-700">{formatBRL(net)}</p>
        </Card>
      </div>
      <p className="text-center text-xs text-neutral-500">
        {(delivered ?? []).length} entregas no mês
      </p>
    </div>
  );
}
