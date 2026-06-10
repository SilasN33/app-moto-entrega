"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm space-y-7">
        <div className="space-y-3 text-center">
          <Logo />
          <h1 className="text-[26px] font-semibold tracking-tighter2 text-ink">
            Definir nova senha
          </h1>
        </div>
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Input
              label="Confirmar"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && (
              <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
                {error}
              </p>
            )}
            <Button type="submit" full size="lg" loading={loading}>
              Salvar e entrar
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
