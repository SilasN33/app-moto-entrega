import { requireAdmin } from "@/lib/auth";
import { PageHeading } from "@/components/ui/PageHeading";
import { NewOrderForm } from "./NewOrderForm";

export default async function NewOrderPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Despachar"
        title="Novo pedido"
        hint="Endereço, valor e observações. O motoboy aceita pelo app dele."
      />
      <NewOrderForm />
    </div>
  );
}
