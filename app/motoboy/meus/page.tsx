import Link from "next/link";
import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { formatBRL } from "@/lib/utils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const me = await requireMotoboy();
  const supabase = await createClient();

  const monthStart = startOfMonth(new Date()).toISOString();
  const monthEnd = endOfMonth(new Date()).toISOString();

  const [{ data: active }, { data: monthDelivered }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("motoboy_id", me.id)
      .in("status", ["picked"])
      .order("picked_at", { ascending: false }),
    supabase
      .from("orders")
      .select("amount")
      .eq("motoboy_id", me.id)
      .eq("status", "delivered")
      .gte("delivered_at", monthStart)
      .lte("delivered_at", monthEnd),
  ]);

  const monthTotal = (monthDelivered ?? []).reduce(
    (s, o) => s + Number(o.amount),
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs text-neutral-500">Você ganhou neste mês</p>
        <p className="mt-1 text-2xl font-bold text-green-700">
          {formatBRL(monthTotal)}
        </p>
        <p className="text-xs text-neutral-500">
          {(monthDelivered ?? []).length} entregas concluídas
        </p>
      </Card>

      <h2 className="text-base font-semibold">Em andamento</h2>
      <div className="space-y-2">
        {(active ?? []).map((o) => (
          <Link key={o.id} href={`/motoboy/meus/${o.id}`}>
            <Card className="flex items-center justify-between gap-3 transition active:scale-[0.99]">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {o.code ? `#${o.code} · ` : ""}
                  {o.customer_name ?? "Cliente"}
                </p>
                <p className="truncate text-xs text-neutral-500">{o.address}</p>
                {o.picked_at && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Pego{" "}
                    {format(new Date(o.picked_at), "HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold">{formatBRL(o.amount)}</span>
                <StatusBadge status={o.status} />
              </div>
            </Card>
          </Link>
        ))}
        {(!active || active.length === 0) && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum pedido em andamento. Veja a fila!
          </Card>
        )}
      </div>
    </div>
  );
}
