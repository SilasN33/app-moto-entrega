"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
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
    method === "phone" ? phone.replace(/\D/g, "").length >= 10 : /.+@.+\..+/.test(email);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl">
            🛵
          </div>
          <h1 className="text-2xl font-bold">Moto Entrega</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {step === "identify"
              ? "Entre com seu telefone ou e-mail"
              : method === "phone"
                ? "Digite o código que enviamos por SMS"
                : "Digite o código que enviamos por e-mail"}
          </p>
        </div>

        <Card className="space-y-4">
          {step === "identify" && (
            <div className="grid grid-cols-2 rounded-xl bg-neutral-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => switchMethod("phone")}
                className={`rounded-lg py-2 font-semibold transition ${
                  method === "phone"
                    ? "bg-white text-neutral-900 shadow"
                    : "text-neutral-500"
                }`}
              >
                Telefone
              </button>
              <button
                type="button"
                onClick={() => switchMethod("email")}
                className={`rounded-lg py-2 font-semibold transition ${
                  method === "email"
                    ? "bg-white text-neutral-900 shadow"
                    : "text-neutral-500"
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
              <Button full onClick={sendCode} loading={loading} disabled={!canSend}>
                Receber código
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-neutral-500">
                Enviado para <strong>{identifier}</strong>
              </p>
              <Input
                label="Código"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                autoFocus
              />
              <Button
                full
                onClick={verifyCode}
                loading={loading}
                disabled={code.length < 4}
              >
                Entrar
              </Button>
              <button
                type="button"
                className="block w-full text-center text-xs text-neutral-500 underline"
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
            <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">
              {error}
            </p>
          )}
        </Card>

        <p className="text-center text-xs text-neutral-500">
          É a loja?{" "}
          <Link
            href="/loja/login"
            className="font-semibold text-brand-600 underline"
          >
            Acesso do estabelecimento
          </Link>
        </p>
      </div>
    </main>
  );
}
