import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const labels: Record<OrderStatus, string> = {
  pending: "Na fila",
  picked: "A caminho",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const styles: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-status-pending-bg", text: "text-status-pending", dot: "bg-status-pending" },
  picked: { bg: "bg-status-picked-bg", text: "text-status-picked", dot: "bg-status-picked" },
  delivered: { bg: "bg-status-delivered-bg", text: "text-status-delivered", dot: "bg-status-delivered" },
  cancelled: { bg: "bg-status-cancelled-bg", text: "text-status-cancelled", dot: "bg-status-cancelled" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium tracking-tightish",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {labels[status]}
    </span>
  );
}
