import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPhoneBR(input: string) {
  const digits = input.replace(/\D/g, "");
  // assume +55, mostra (DD) NNNNN-NNNN
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length < 10) return input;
  const dd = local.slice(0, 2);
  const a = local.slice(2, local.length - 4);
  const b = local.slice(-4);
  return `(${dd}) ${a}-${b}`;
}

export function toE164BR(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}
