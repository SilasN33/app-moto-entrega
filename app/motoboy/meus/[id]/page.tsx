import { notFound } from "next/navigation";
import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeliverForm } from "./DeliverForm";

export const dynamic = "force-dynamic";

export default async function MyOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireMotoboy();
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("motoboy_id", me.id)
    .maybeSingle();

  if (!order) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {order.code ? `Pedido #${order.code}` : "Pedido"}
        </h2>
        <StatusBadge status={order.status} />
      </div>

      <Card className="space-y-2">
        <Row label="Cliente" value={order.customer_name ?? "—"} />
        {order.customer_phone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">Telefone</span>
            <a
              href={`tel:${order.customer_phone}`}
              className="text-sm font-medium text-brand-600"
            >
              {order.customer_phone}
            </a>
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm text-neutral-500">Endereço</span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              order.address
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-right text-sm font-medium text-brand-600 underline"
          >
            {order.address}
          </a>
        </div>
        {order.notes && <Row label="Obs." value={order.notes} />}
        <Row label="Você recebe" value={formatBRL(order.amount)} />
        {order.picked_at && (
          <Row
            label="Pego em"
            value={format(new Date(order.picked_at), "dd/MM HH:mm", {
              locale: ptBR,
            })}
          />
        )}
      </Card>

      {order.status === "picked" && <DeliverForm orderId={order.id} />}

      {order.status === "delivered" && order.photo_url && (
        <Card>
          <p className="mb-2 text-sm font-medium">Foto enviada</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={order.photo_url}
            alt="Foto da entrega"
            className="aspect-square w-full rounded-xl object-cover"
          />
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
