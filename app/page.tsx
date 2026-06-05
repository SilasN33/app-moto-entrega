import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "MotoEntrega — operação de delivery, sem planilha",
  description:
    "Cadastre seus motoboys, despache pedidos pelo app e feche o pagamento do mês com um botão. Feito pra restaurantes com frota própria.",
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      {/* Top bar */}
      <header className="safe-top sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-[13px] font-medium text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink sm:inline-flex"
            >
              Sou motoboy
            </Link>
            <Link
              href="/loja/login"
              className="inline-flex items-center gap-1 rounded-lg bg-ink px-3.5 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-2"
            >
              Acesso da loja
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_1fr] md:py-24 lg:py-28">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Cockpit de delivery
            </span>
            <h1 className="text-[44px] font-semibold leading-[1.04] tracking-tighter2 text-ink md:text-[56px] lg:text-[64px]">
              Sua operação de delivery,
              <br />
              <span className="text-ink-3">sem planilha.</span>
            </h1>
            <p className="max-w-xl text-[17px] leading-relaxed text-ink-3">
              Cadastre seus motoboys, despache pedidos pelo app e feche o
              pagamento do mês com um botão. Feito pra restaurantes que rodam
              com frota própria.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/loja/login">
                <Button size="lg" className="gap-1.5">
                  Começar agora
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex h-12 items-center rounded-lg px-4 text-[15px] font-medium text-ink-2 transition-colors hover:bg-paper-2"
              >
                Como funciona →
              </Link>
            </div>

            {/* Metric strip */}
            <dl className="mt-6 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              <Metric label="Pedidos / dia" value="48" />
              <Metric label="Motoboys" value="07" />
              <Metric label="A pagar" value="R$ 2.140" emphasis />
            </dl>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative aspect-[16/12] overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-paper-lg">
              <Image
                src="/brand/hero-1920.webp"
                alt="Capacete de motoboy sobre superfície clara, com linha de rota brasa que marca o trajeto até um pin de entrega"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              {/* Overlay UI element — cupom de entrega */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-auto md:max-w-[280px]">
                <div className="rounded-xl border border-line bg-paper/95 p-3 shadow-paper-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-ink-4">
                    <span>Pedido</span>
                    <span className="font-mono text-ink-3">#1042</span>
                  </div>
                  <div className="mt-1 text-[13px] font-medium text-ink">
                    Marina · Rua Aurora, 312
                  </div>
                  <hr className="divider-dashed my-2" />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-status-picked">
                      <span className="h-1.5 w-1.5 rounded-full bg-status-picked" />
                      A caminho
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-ink">
                      R$ 14,00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line/70 bg-paper-2/40 paper-grain">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
              Por que MotoEntrega
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tighter2 md:text-4xl">
              O suficiente. Nada além.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
              Foi feito pra rodar nas duas pontas: o tablet da cozinha e o
              celular do motoboy. Sem dashboards inúteis, sem onboarding de
              vinte telas.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              num="01"
              title="Frota nominal"
              body="Cada motoboy é exclusivo da sua loja. Você sabe quem está rodando, quem entregou, quem aceitou. Sem fila pública anônima."
            />
            <Feature
              num="02"
              title="Pagamento transparente"
              body="Bruto menos descontos é igual a a pagar. A conta aparece no relatório do mês — pro dono e pro motoboy. Sem mistério."
            />
            <Feature
              num="03"
              title="Mobile-first PWA"
              body="O motoboy abre no navegador, instala como app e sai rodando. Comprovante por foto, mapa do endereço, ligação direta."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="como-funciona"
        className="border-t border-line/70"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
                Como funciona
              </span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tighter2 md:text-4xl">
                Três passos. É só isso.
              </h2>
            </div>
            <Link
              href="/loja/login"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-ink hover:text-ember"
            >
              Pular pra cadastrar minha loja
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            <Step
              n="1"
              title="Cadastra"
              body="Crie sua loja e adicione seus motoboys por telefone ou e-mail. Eles entram no app na primeira vez que receberem o código."
            />
            <Step
              n="2"
              title="Despacha"
              body="Crie o pedido com endereço, observação e valor da entrega. O motoboy aceita pelo celular dele e marca quando entregar (com foto)."
            />
            <Step
              n="3"
              title="Fecha o mês"
              body="Abra o relatório: cada motoboy com bruto, descontos e total a pagar. Imprime, exporta, paga. Próximo mês começa zerado."
            />
          </ol>
        </div>
      </section>

      {/* Big number / accountability */}
      <section className="border-t border-line/70 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="space-y-5">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
              Transparência por padrão
            </span>
            <h2 className="text-3xl font-semibold tracking-tighter2 md:text-4xl">
              Cada centavo aparece de onde veio e pra onde vai.
            </h2>
            <p className="text-[15px] leading-relaxed text-paper/70">
              O motoboy abre o app e vê o que ganhou no dia, na semana, no mês.
              A loja abre o relatório e vê a mesma conta. Não tem versão da
              loja diferente da versão do motoboy.
            </p>
          </div>
          <div className="rounded-xl border border-paper/15 bg-ink p-6 font-mono text-[13px] leading-relaxed text-paper/90">
            <div className="text-[10px] uppercase tracking-[0.2em] text-paper/40">
              Relatório · Junho · João S.
            </div>
            <hr className="my-3 border-paper/15" />
            <Row label="Entregas concluídas">24</Row>
            <Row label="Bruto">R$ 312,00</Row>
            <Row label="Descontos">− R$ 28,00</Row>
            <hr className="my-3 border-dashed border-paper/25" />
            <Row label="A pagar" emphasis>
              R$ 284,00
            </Row>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line/70">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tighter2 md:text-[40px]">
            Pronto pra parar de fazer conta no caderno?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
            Cadastre sua loja em minutos. É grátis pra começar.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/loja/login">
              <Button size="lg" className="gap-1.5">
                Criar conta de loja
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sou motoboy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="safe-bottom border-t border-line/70 bg-paper-2/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-[13px] text-ink-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline">
              Operação de delivery, sem planilha.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/loja/login" className="hover:text-ink">
              Loja
            </Link>
            <Link href="/login" className="hover:text-ink">
              Motoboy
            </Link>
            <span className="text-ink-4">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-paper px-3 py-3">
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-4">
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? "mt-1 font-mono text-[15px] font-semibold text-ember"
            : "mt-1 font-mono text-[15px] font-semibold text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function Feature({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-6">
      <div className="font-mono text-[12px] text-ink-4">{num}</div>
      <h3 className="mt-2 text-[19px] font-semibold tracking-tightish text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="relative bg-paper p-6">
      <div className="font-mono text-[12px] text-ember">Passo {n}</div>
      <h3 className="mt-2 text-[20px] font-semibold tracking-tightish text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{body}</p>
    </li>
  );
}

function Row({
  label,
  children,
  emphasis,
}: {
  label: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-paper/60">{label}</span>
      <span
        className={
          emphasis
            ? "font-mono text-[18px] font-semibold text-ember"
            : "font-mono text-paper"
        }
      >
        {children}
      </span>
    </div>
  );
}
