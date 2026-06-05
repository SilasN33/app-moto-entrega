import Link from "next/link";
import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageHeading, SectionHeading } from "@/components/ui/PageHeading";
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
    0,
  );
  const deliveredCount = (monthDelivered ?? []).length;

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Você" title="Meus pedidos" />

      <Card tone="raised" className="space-y-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-4">
          Você ganhou neste mês
        </p>
        <p className="font-mono text-[32px] font-semibold leading-none tracking-tighter2 text-ember">
          {formatBRL(monthTotal)}
        </p>
        <p className="text-[12px] text-ink-3">
          {deliveredCount} entrega{deliveredCount === 1 ? "" : "s"} concluída
          {deliveredCount === 1 ? "" : "s"}.
        </p>
      </Card>

      <div className="space-y-3">
        <SectionHeading hint={`${(active ?? []).length} em andamento`}>
          Em rota agora
        </SectionHeading>
        <div className="space-y-2">
          {(active ?? []).map((o) => (
            <Link key={o.id} href={`/motoboy/meus/${o.id}`} className="block">
              <Card interactive className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    {o.code && (
                      <span className="font-mono text-[12px] text-ink-4">
                        #{o.code}
                      </span>
                    )}
                    <p className="truncate text-[15px] font-medium text-ink">
                      {o.customer_name ?? "Cliente"}
                    </p>
                  </div>
                  <p className="route-line truncate text-[13px] text-ink-2">
                    {o.address}
                  </p>
                  {o.picked_at && (
                    <p className="font-mono text-[11px] text-ink-4">
                      Pego {format(new Date(o.picked_at), "HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-mono text-[15px] font-semibold text-ink">
                    {formatBRL(o.amount)}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
              </Card>
            </Link>
          ))}
          {(!active || active.length === 0) && (
            <Card className="flex flex-col gap-1 py-10 text-center">
              <p className="text-[13px] font-medium text-ink-2">
                Nenhum pedido em andamento.
              </p>
              <p className="text-[12px] text-ink-4">
                Confira a fila pra pegar o próximo.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
