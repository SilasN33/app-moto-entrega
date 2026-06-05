import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { PageHeading, SectionHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PickOrderButton } from "./PickOrderButton";
import { QueueRealtime } from "./QueueRealtime";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  await requireMotoboy();
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .is("motoboy_id", null)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <QueueRealtime />
      <PageHeading
        eyebrow="Em rota"
        title="Fila de pedidos"
        hint="Atualiza automaticamente quando entrar pedido novo."
      />

      <div className="space-y-3">
        <SectionHeading hint={`${(orders ?? []).length} disponível(is)`}>
          Aguardando motoboy
        </SectionHeading>
        <div className="space-y-2">
          {(orders ?? []).map((o) => (
            <Card key={o.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
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
                  <p className="route-line text-[13px] text-ink-2">
                    {o.address}
                  </p>
                  {o.notes && (
                    <p className="text-[12px] italic text-ink-3">
                      Obs: {o.notes}
                    </p>
                  )}
                  <p className="text-[11px] text-ink-4">
                    {format(new Date(o.created_at), "dd/MM HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="rounded-md bg-ember-weak px-2.5 py-1.5 text-right">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-ember/70">
                    Você ganha
                  </p>
                  <p className="font-mono text-[15px] font-semibold text-ember">
                    {formatBRL(o.amount)}
                  </p>
                </div>
              </div>
              <PickOrderButton orderId={o.id} />
            </Card>
          ))}
          {(!orders || orders.length === 0) && (
            <Card className="flex flex-col items-center gap-1 py-10 text-center">
              <p className="text-[13px] font-medium text-ink-2">
                Nenhum pedido na fila.
              </p>
              <p className="text-[12px] text-ink-4">
                Vamos atualizar quando entrar um novo.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
