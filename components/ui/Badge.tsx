import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const labels: Record<OrderStatus, string> = {
  pending: "Na fila",
  picked: "A caminho",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  picked: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
