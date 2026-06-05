import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { PageHeading, SectionHeading } from "@/components/ui/PageHeading";
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

  const activeCount = (motoboys ?? []).filter((m) => m.active).length;

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Frota"
        title="Motoboys"
        hint="Sua base de entregadores vinculados a essa loja."
      />

      <NewMotoboyForm />

      <div className="space-y-3">
        <SectionHeading
          hint={`${activeCount} ativo(s) · ${(motoboys ?? []).length} total`}
        >
          Cadastrados
        </SectionHeading>
        <div className="space-y-2">
          {(motoboys ?? []).map((m) => (
            <Card key={m.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-ink">
                  {m.full_name}
                </p>
                <p className="truncate font-mono text-[12px] text-ink-4">
                  {m.phone ? formatPhoneBR(m.phone) : (m.email ?? "—")}
                </p>
              </div>
              <ToggleActive id={m.id} active={m.active} />
            </Card>
          ))}
          {(!motoboys || motoboys.length === 0) && (
            <Card className="py-10 text-center text-[13px] text-ink-3">
              Nenhum motoboy cadastrado.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
