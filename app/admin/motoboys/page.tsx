import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { formatPhoneBR } from "@/lib/utils";
import { NewMotoboyForm } from "./NewMotoboyForm";
import { ToggleActive } from "./ToggleActive";

export const dynamic = "force-dynamic";

export default async function MotoboysPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: motoboys } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "motoboy")
    .order("full_name");

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Motoboys</h2>

      <NewMotoboyForm />

      <div className="space-y-2">
        {(motoboys ?? []).map((m) => (
          <Card key={m.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{m.full_name}</p>
              <p className="truncate text-xs text-neutral-500">
                {m.phone ? formatPhoneBR(m.phone) : m.email ?? "—"}
              </p>
            </div>
            <ToggleActive id={m.id} active={m.active} />
          </Card>
        ))}
        {(!motoboys || motoboys.length === 0) && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum motoboy cadastrado.
          </Card>
        )}
      </div>
    </div>
  );
}
