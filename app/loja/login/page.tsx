"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function StoreLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function sendReset() {
    setError(null);
    if (!email) {
      setError("Informe seu e-mail antes.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/loja/redefinir-senha`,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setResetSent(true);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl">
            🏪
          </div>
          <h1 className="text-2xl font-bold">Acesso da loja</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Entre com o e-mail e senha do estabelecimento
          </p>
        </div>

        <Card>
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="loja@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">
                {error}
              </p>
            )}
            {resetSent && (
              <p className="rounded-lg bg-green-50 p-2 text-xs text-green-700">
                E-mail de redefinição enviado.
              </p>
            )}
            <Button type="submit" full loading={loading} disabled={!email || !password}>
              Entrar
            </Button>
            <button
              type="button"
              onClick={sendReset}
              className="block w-full text-center text-xs text-neutral-500 underline"
            >
              Esqueci minha senha
            </button>
          </form>
        </Card>

        <p className="text-center text-xs text-neutral-500">
          É motoboy?{" "}
          <Link href="/login" className="font-semibold text-brand-600 underline">
            Entrar com telefone
          </Link>
        </p>
      </div>
    </main>
  );
}
