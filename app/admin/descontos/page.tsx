import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { PageHeading, SectionHeading } from "@/components/ui/PageHeading";
import { formatBRL } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NewDeductionForm } from "./NewDeductionForm";

export const dynamic = "force-dynamic";

export default async function DeductionsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: deductions }, { data: motoboys }] = await Promise.all([
    supabase
      .from("deductions")
      .select("*, motoboy:profiles!deductions_motoboy_id_fkey(full_name)")
      .order("ref_date", { ascending: false })
      .limit(100),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "motoboy")
      .order("full_name"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Acerto"
        title="Descontos"
        hint="Registre o que precisa ser abatido no fechamento de cada motoboy."
      />

      <NewDeductionForm motoboys={motoboys ?? []} />

      <div className="space-y-3">
        <SectionHeading>Histórico</SectionHeading>
        <div className="space-y-2">
          {(deductions ?? []).map((d) => (
            <Card
              key={d.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-ink">
                  {(d.motoboy as { full_name: string } | null)?.full_name ?? "—"}
                </p>
                <p className="truncate text-[12px] text-ink-3">{d.reason}</p>
                <p className="font-mono text-[11px] text-ink-4">
                  {format(new Date(d.ref_date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <span className="font-mono text-[15px] font-semibold text-ember">
                − {formatBRL(d.amount)}
              </span>
            </Card>
          ))}
          {(!deductions || deductions.length === 0) && (
            <Card className="py-10 text-center text-[13px] text-ink-3">
              Nenhum desconto registrado.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
