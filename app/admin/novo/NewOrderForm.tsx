"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const QUICK_AMOUNTS = [5, 10, 14];

export function NewOrderForm() {
  const router = useRouter();
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState<number | "">(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!address || !amount) {
      setError("Endereço e valor são obrigatórios.");
      return;
    }
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("store_id")
      .eq("id", user!.id)
      .single();

    const { error } = await supabase.from("orders").insert({
      store_id: profile!.store_id,
      code: code || null,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      address,
      notes: notes || null,
      amount: Number(amount),
      created_by: user!.id,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Código (opcional)"
          placeholder="#1042"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          label="Cliente"
          placeholder="Nome do cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <Input
          label="Telefone do cliente"
          inputMode="tel"
          placeholder="(11) 99999-9999"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
        <Input
          label="Endereço *"
          placeholder="Rua, número, bairro"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          label="Observações"
          placeholder="Apto 12, portão azul..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="space-y-2">
          <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">
            Valor pago ao motoboy *
          </label>
          <div className="flex gap-2">
            {QUICK_AMOUNTS.map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setAmount(v)}
                className={`flex-1 rounded-lg border py-2.5 font-mono text-[14px] font-semibold transition-colors ${
                  amount === v
                    ? "border-ember bg-ember-weak text-ember"
                    : "border-line bg-paper text-ink-3 hover:border-line-strong hover:text-ink"
                }`}
              >
                R$ {v}
              </button>
            ))}
          </div>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Outro valor"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        {error && (
          <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} full size="lg">
          Criar pedido
        </Button>
      </form>
    </Card>
  );
}
