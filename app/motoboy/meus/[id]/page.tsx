import { notFound } from "next/navigation";
import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardDivider } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Phone, MapPin } from "lucide-react";
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

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`;

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={order.code ? `#${order.code}` : "Em rota"}
        title={order.customer_name ?? "Pedido"}
        action={<StatusBadge status={order.status} />}
      />

      <Card>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-3 rounded-lg p-1 hover:bg-paper-2"
        >
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
              Endereço · abrir no mapa
            </p>
            <p className="text-[15px] font-medium text-ink">{order.address}</p>
          </div>
        </a>

        {order.customer_phone && (
          <>
            <CardDivider />
            <a
              href={`tel:${order.customer_phone}`}
              className="flex items-center gap-3 rounded-lg p-1 hover:bg-paper-2"
            >
              <Phone className="h-4 w-4 shrink-0 text-ember" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
                  Cliente · toque pra ligar
                </p>
                <p className="font-mono text-[15px] font-medium text-ink">
                  {order.customer_phone}
                </p>
              </div>
            </a>
          </>
        )}

        {order.notes && (
          <>
            <CardDivider />
            <div className="p-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
                Observação
              </p>
              <p className="text-[14px] italic text-ink-2">{order.notes}</p>
            </div>
          </>
        )}

        <CardDivider />
        <div className="flex items-baseline justify-between p-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
            Você recebe
          </span>
          <span className="font-mono text-[20px] font-semibold text-ember">
            {formatBRL(order.amount)}
          </span>
        </div>

        {order.picked_at && (
          <>
            <CardDivider />
            <div className="flex items-baseline justify-between p-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
                Pego em
              </span>
              <span className="font-mono text-[13px] text-ink-2">
                {format(new Date(order.picked_at), "dd/MM HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </>
        )}
      </Card>

      {order.status === "picked" && <DeliverForm orderId={order.id} />}

      {order.status === "delivered" && order.photo_url && (
        <Card>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Comprovante
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={order.photo_url}
            alt="Foto da entrega"
            className="aspect-square w-full rounded-lg border border-line object-cover"
          />
        </Card>
      )}
    </div>
  );
}
