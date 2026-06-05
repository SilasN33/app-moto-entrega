"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { toE164BR } from "@/lib/utils";

type Method = "phone" | "email";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [method, setMethod] = useState<Method>("phone");
  const [step, setStep] = useState<"identify" | "code">("identify");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchMethod(next: Method) {
    setMethod(next);
    setStep("identify");
    setCode("");
    setError(null);
  }

  async function sendCode() {
    setError(null);
    setLoading(true);
    let res;
    if (method === "phone") {
      res = await supabase.auth.signInWithOtp({ phone: toE164BR(phone) });
    } else {
      res = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
    }
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setStep("code");
  }

  async function verifyCode() {
    setError(null);
    setLoading(true);
    let res;
    if (method === "phone") {
      res = await supabase.auth.verifyOtp({
        phone: toE164BR(phone),
        token: code,
        type: "sms",
      });
    } else {
      res = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: "email",
      });
    }
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const identifier = method === "phone" ? phone : email;
  const canSend =
    method === "phone"
      ? phone.replace(/\D/g, "").length >= 10
      : /.+@.+\..+/.test(email);

  return (
    <main className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm space-y-7">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <div>
            <h1 className="text-[26px] font-semibold tracking-tighter2 text-ink">
              Entrar como motoboy
            </h1>
            <p className="mt-1 text-[14px] text-ink-3">
              {step === "identify"
                ? "Use seu telefone ou e-mail. Mandamos um código."
                : method === "phone"
                  ? "Digite o código que enviamos por SMS"
                  : "Digite o código que enviamos por e-mail"}
            </p>
          </div>
        </div>

        <Card className="space-y-4">
          {step === "identify" && (
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-paper-2 p-1 text-[13px]">
              <button
                type="button"
                onClick={() => switchMethod("phone")}
                className={`rounded-md py-1.5 font-medium transition-colors ${
                  method === "phone"
                    ? "bg-paper text-ink shadow-paper"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                Telefone
              </button>
              <button
                type="button"
                onClick={() => switchMethod("email")}
                className={`rounded-md py-1.5 font-medium transition-colors ${
                  method === "email"
                    ? "bg-paper text-ink shadow-paper"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                E-mail
              </button>
            </div>
          )}

          {step === "identify" ? (
            <>
              {method === "phone" ? (
                <Input
                  label="Telefone"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                />
              ) : (
                <Input
                  label="E-mail"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              )}
              <Button full size="lg" onClick={sendCode} loading={loading} disabled={!canSend}>
                Receber código
              </Button>
            </>
          ) : (
            <>
              <p className="text-[12px] text-ink-4">
                Enviado para <span className="font-medium text-ink-2">{identifier}</span>
              </p>
              <Input
                label="Código"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                autoFocus
                className="font-mono tracking-[0.4em]"
              />
              <Button
                full
                size="lg"
                onClick={verifyCode}
                loading={loading}
                disabled={code.length < 4}
              >
                Entrar
              </Button>
              <button
                type="button"
                className="block w-full text-center text-[12px] text-ink-4 underline underline-offset-4 hover:text-ink-2"
                onClick={() => {
                  setStep("identify");
                  setCode("");
                }}
              >
                Trocar {method === "phone" ? "número" : "e-mail"}
              </button>
            </>
          )}

          {error && (
            <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
              {error}
            </p>
          )}
        </Card>

        <p className="text-center text-[12px] text-ink-4">
          É a loja?{" "}
          <Link
            href="/loja/login"
            className="font-medium text-ink-2 underline underline-offset-4 hover:text-ember"
          >
            Acesso do estabelecimento
          </Link>
        </p>
      </div>
    </main>
  );
}
