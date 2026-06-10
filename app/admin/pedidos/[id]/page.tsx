import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardDivider } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CancelOrderButton } from "./CancelOrderButton";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, motoboy:profiles!orders_motoboy_id_fkey(full_name, phone)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={order.code ? `#${order.code}` : "Pedido"}
        title={order.customer_name ?? "Detalhes do pedido"}
        action={<StatusBadge status={order.status} />}
      />

      <Card>
        <Row label="Endereço" value={order.address} />
        {order.customer_phone && (
          <>
            <CardDivider />
            <Row label="Telefone" value={order.customer_phone} mono />
          </>
        )}
        {order.notes && (
          <>
            <CardDivider />
            <Row label="Observação" value={order.notes} />
          </>
        )}
        <CardDivider />
        <Row label="Valor" value={formatBRL(order.amount)} mono emphasis />
        <CardDivider />
        <Row
          label="Criado"
          value={format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}
        />
        {order.motoboy && (
          <>
            <CardDivider />
            <Row
              label="Motoboy"
              value={(order.motoboy as { full_name: string }).full_name}
            />
          </>
        )}
        {order.delivered_at && (
          <>
            <CardDivider />
            <Row
              label="Entregue"
              value={format(new Date(order.delivered_at), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            />
          </>
        )}
      </Card>

      {order.photo_url && (
        <Card>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
            Comprovante de entrega
          </p>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-paper-2">
            <Image
              src={order.photo_url}
              alt="Foto da entrega"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </Card>
      )}

      {order.status !== "cancelled" && order.status !== "delivered" && (
        <CancelOrderButton orderId={order.id} />
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-[12px] uppercase tracking-[0.08em] text-ink-4">
        {label}
      </span>
      <span
        className={`text-right text-[14px] ${
          mono ? "font-mono" : ""
        } ${emphasis ? "font-semibold text-ember" : "font-medium text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
