"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function NewMotoboyForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone && !email) {
      setError("Informe telefone ou e-mail.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/motoboys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name, phone, email }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Erro ao cadastrar");
      return;
    }
    setName("");
    setPhone("");
    setEmail("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button full variant="secondary" onClick={() => setOpen(true)}>
        + Cadastrar motoboy
      </Button>
    );
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <Input
          label="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Input
          label="Telefone (com DDD)"
          inputMode="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="Telefone ou e-mail — pelo menos um."
        />
        <Input
          label="E-mail"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          placeholder="motoboy@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            Cadastrar
          </Button>
        </div>
      </form>
    </Card>
  );
}
