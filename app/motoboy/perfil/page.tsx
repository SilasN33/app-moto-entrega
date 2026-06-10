import { requireMotoboy } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardDivider } from "@/components/ui/Card";
import { PageHeading } from "@/components/ui/PageHeading";
import { formatBRL, formatPhoneBR } from "@/lib/utils";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const me = await requireMotoboy();
  const supabase = await createClient();

  const now = new Date();
  const monthStart = startOfMonth(now).toISOString();
  const monthEnd = endOfMonth(now).toISOString();

  const [{ data: delivered }, { data: deductions }] = await Promise.all([
    supabase
      .from("orders")
      .select("amount")
      .eq("motoboy_id", me.id)
      .eq("status", "delivered")
      .gte("delivered_at", monthStart)
      .lte("delivered_at", monthEnd),
    supabase
      .from("deductions")
      .select("amount")
      .eq("motoboy_id", me.id)
      .gte("ref_date", monthStart.slice(0, 10))
      .lte("ref_date", monthEnd.slice(0, 10)),
  ]);

  const gross = (delivered ?? []).reduce((s, o) => s + Number(o.amount), 0);
  const ded = (deductions ?? []).reduce((s, d) => s + Number(d.amount), 0);
  const net = gross - ded;
  const deliveredCount = (delivered ?? []).length;

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Você" title="Perfil" />

      <Card>
        <p className="text-[18px] font-semibold tracking-tighter2 text-ink">
          {me.full_name}
        </p>
        {me.phone && (
          <p className="font-mono text-[12px] text-ink-3">
            {formatPhoneBR(me.phone)}
          </p>
        )}
        {me.email && (
          <p className="text-[12px] text-ink-3">{me.email}</p>
        )}
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink-3">
            Fechamento — {format(now, "MMMM/yyyy", { locale: ptBR })}
          </p>
          <span className="font-mono text-[11px] text-ink-4">
            {deliveredCount} entregas
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          <Row label="Bruto" value={formatBRL(gross)} />
          <Row label="Descontos" value={`− ${formatBRL(ded)}`} tone="muted" />
          <CardDivider />
          <Row label="A receber" value={formatBRL(net)} tone="emphasis" big />
        </div>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  tone = "default",
  big,
}: {
  label: string;
  value: string;
  tone?: "default" | "muted" | "emphasis";
  big?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`text-[13px] ${
          tone === "emphasis" ? "font-medium text-ink" : "text-ink-3"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono ${big ? "text-[22px] font-semibold" : "text-[14px]"} ${
          tone === "emphasis"
            ? "text-ember"
            : tone === "muted"
              ? "text-ink-3"
              : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
