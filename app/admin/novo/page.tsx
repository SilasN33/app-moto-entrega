import { requireAdmin } from "@/lib/auth";
import { NewOrderForm } from "./NewOrderForm";

export default async function NewOrderPage() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Novo pedido</h2>
      <NewOrderForm />
    </div>
  );
}
