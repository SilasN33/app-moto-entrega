"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

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
    <main className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm space-y-7">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <div>
            <h1 className="text-[26px] font-semibold tracking-tighter2 text-ink">
              Acesso da loja
            </h1>
            <p className="mt-1 text-[14px] text-ink-3">
              Entre com o e-mail e senha do estabelecimento.
            </p>
          </div>
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
              <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
                {error}
              </p>
            )}
            {resetSent && (
              <p className="rounded-md border border-status-delivered/30 bg-status-delivered-bg px-3 py-2 text-[12px] text-status-delivered">
                E-mail de redefinição enviado.
              </p>
            )}
            <Button
              type="submit"
              full
              size="lg"
              loading={loading}
              disabled={!email || !password}
            >
              Entrar
            </Button>
            <button
              type="button"
              onClick={sendReset}
              className="block w-full text-center text-[12px] text-ink-4 underline underline-offset-4 hover:text-ink-2"
            >
              Esqueci minha senha
            </button>
          </form>
        </Card>

        <p className="text-center text-[12px] text-ink-4">
          É motoboy?{" "}
          <Link
            href="/login"
            className="font-medium text-ink-2 underline underline-offset-4 hover:text-ember"
          >
            Entrar com telefone
          </Link>
        </p>
      </div>
    </main>
  );
}
