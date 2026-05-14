"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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
      <Button full variant="secondary" onClick={() => setOpen(true)}>
        + Novo desconto
      </Button>
    );
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Motoboy</label>
          <select
            value={motoboyId}
            onChange={(e) => setMotoboyId(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base"
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
          <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{error}</p>
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
