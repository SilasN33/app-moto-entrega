"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";

export function NewDeductionForm({
  motoboys,
}: {
  motoboys: { id: string; full_name: string }[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [motoboyId, setMotoboyId] = useState(motoboys[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("store_id")
      .eq("id", user!.id)
      .single();

    const { error } = await supabase.from("deductions").insert({
      store_id: profile!.store_id,
      motoboy_id: motoboyId,
      amount: Number(amount),
      reason,
      created_by: user!.id,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setAmount("");
    setReason("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button full variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" strokeWidth={2} />
        Novo desconto
      </Button>
    );
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">
            Motoboy
          </label>
          <select
            value={motoboyId}
            onChange={(e) => setMotoboyId(e.target.value)}
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          >
            {motoboys.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Valor (R$)"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Motivo"
          placeholder="Pedido cancelado, refeição, etc."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        {error && (
          <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            full
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" full loading={loading}>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  );
}
