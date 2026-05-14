import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, motoboy:profiles!orders_motoboy_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const totalToday = (orders ?? [])
    .filter(
      (o) =>
        new Date(o.created_at).toDateString() === new Date().toDateString() &&
        o.status === "delivered"
    )
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pendingCount = (orders ?? []).filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-neutral-500">Entregue hoje</p>
          <p className="mt-1 text-xl font-bold">{formatBRL(totalToday)}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500">Na fila</p>
          <p className="mt-1 text-xl font-bold">{pendingCount}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Pedidos recentes</h2>
        <Link href="/admin/novo" className="text-sm font-semibold text-brand-600">
          + Novo pedido
        </Link>
      </div>

      <div className="space-y-2">
        {(orders ?? []).map((o) => (
          <Link key={o.id} href={`/admin/pedidos/${o.id}`}>
            <Card className="flex items-center justify-between gap-3 transition active:scale-[0.99]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">
                    {o.code ? `#${o.code} · ` : ""}
                    {o.customer_name ?? "Cliente"}
                  </p>
                </div>
                <p className="truncate text-xs text-neutral-500">{o.address}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {format(new Date(o.created_at), "dd/MM HH:mm", { locale: ptBR })}
                  {o.motoboy
                    ? ` · ${(o.motoboy as { full_name: string }).full_name}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold">{formatBRL(o.amount)}</span>
                <StatusBadge status={o.status} />
              </div>
            </Card>
          </Link>
        ))}
        {(!orders || orders.length === 0) && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum pedido ainda.
          </Card>
        )}
      </div>
    </div>
  );
}
