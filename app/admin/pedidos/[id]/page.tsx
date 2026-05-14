import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {order.code ? `Pedido #${order.code}` : "Pedido"}
        </h2>
        <StatusBadge status={order.status} />
      </div>

      <Card className="space-y-2">
        <Row label="Cliente" value={order.customer_name ?? "—"} />
        <Row label="Telefone" value={order.customer_phone ?? "—"} />
        <Row label="Endereço" value={order.address} />
        {order.notes && <Row label="Obs." value={order.notes} />}
        <Row label="Valor" value={formatBRL(order.amount)} />
        <Row
          label="Criado em"
          value={format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}
        />
        {order.motoboy && (
          <Row
            label="Motoboy"
            value={(order.motoboy as { full_name: string }).full_name}
          />
        )}
        {order.delivered_at && (
          <Row
            label="Entregue em"
            value={format(new Date(order.delivered_at), "dd/MM/yyyy HH:mm", {
              locale: ptBR,
            })}
          />
        )}
      </Card>

      {order.photo_url && (
        <Card>
          <p className="mb-2 text-sm font-medium">Foto da entrega</p>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
