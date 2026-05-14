import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PickOrderButton } from "./PickOrderButton";

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
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Fila de pedidos</h2>

      <div className="space-y-2">
        {(orders ?? []).map((o) => (
          <Card key={o.id} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {o.code ? `#${o.code} · ` : ""}
                  {o.customer_name ?? "Cliente"}
                </p>
                <p className="truncate text-xs text-neutral-500">{o.address}</p>
                {o.notes && (
                  <p className="mt-1 truncate text-xs text-neutral-500">
                    Obs: {o.notes}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  {format(new Date(o.created_at), "dd/MM HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <span className="rounded-lg bg-brand-50 px-2 py-1 font-bold text-brand-700">
                {formatBRL(o.amount)}
              </span>
            </div>
            <PickOrderButton orderId={o.id} />
          </Card>
        ))}
        {(!orders || orders.length === 0) && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum pedido na fila no momento. ☕
          </Card>
        )}
      </div>
    </div>
  );
}
