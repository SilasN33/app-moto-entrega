import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageHeading, SectionHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, motoboy:profiles!orders_motoboy_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const today = new Date().toDateString();
  const todayOrders = (orders ?? []).filter(
    (o) => new Date(o.created_at).toDateString() === today,
  );
  const totalToday = todayOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.amount), 0);
  const pendingCount = (orders ?? []).filter((o) => o.status === "pending").length;
  const onTheRoadCount = (orders ?? []).filter((o) => o.status === "picked").length;

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Cockpit"
        title="Pedidos"
        hint="Acompanhamento da operação em tempo real."
        action={
          <Link
            href="/admin/novo"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3 text-[13px] font-medium text-paper hover:bg-ink-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Novo pedido
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
        <Stat label="Entregue hoje" value={formatBRL(totalToday)} mono emphasis />
        <Stat label="A caminho" value={String(onTheRoadCount).padStart(2, "0")} mono />
        <Stat label="Na fila" value={String(pendingCount).padStart(2, "0")} mono />
      </div>

      <div className="space-y-3">
        <SectionHeading>Pedidos recentes</SectionHeading>
        <div className="space-y-2">
          {(orders ?? []).map((o) => (
            <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="block">
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
                  <p className="truncate text-[13px] text-ink-3">{o.address}</p>
                  <p className="text-[11px] text-ink-4">
                    {format(new Date(o.created_at), "dd/MM HH:mm", {
                      locale: ptBR,
                    })}
                    {o.motoboy
                      ? ` · ${(o.motoboy as { full_name: string }).full_name}`
                      : ""}
                  </p>
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
          {(!orders || orders.length === 0) && (
            <Card className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-[13px] text-ink-3">Nenhum pedido ainda.</p>
              <Link
                href="/admin/novo"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-ember hover:underline"
              >
                Criar o primeiro <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
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
    <div className="bg-paper p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-4">
        {label}
      </p>
      <p
        className={`mt-1.5 text-[20px] font-semibold tracking-tightish ${
          mono ? "font-mono" : ""
        } ${emphasis ? "text-ember" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}
