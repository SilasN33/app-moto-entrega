import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
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
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Descontos</h2>

      <NewDeductionForm motoboys={motoboys ?? []} />

      <div className="space-y-2">
        {(deductions ?? []).map((d) => (
          <Card key={d.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {(d.motoboy as { full_name: string } | null)?.full_name ?? "—"}
              </p>
              <p className="truncate text-xs text-neutral-500">{d.reason}</p>
              <p className="text-xs text-neutral-500">
                {format(new Date(d.ref_date), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <span className="font-semibold text-red-600">
              − {formatBRL(d.amount)}
            </span>
          </Card>
        ))}
        {(!deductions || deductions.length === 0) && (
          <Card className="text-center text-sm text-neutral-500">
            Nenhum desconto registrado.
          </Card>
        )}
      </div>
    </div>
  );
}
