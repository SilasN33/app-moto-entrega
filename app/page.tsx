import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ScrollVideo } from "@/components/ScrollVideo";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "MotoEntrega — operação de delivery, sem planilha",
  description:
    "Cadastre seus motoboys, despache pedidos pelo app e feche o pagamento do mês com um botão. Feito pra restaurantes com frota própria.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh bg-ink text-paper">
      {/* Vídeo de jornada full-bleed scroll-scrubbed (fica atrás de tudo pela ordem do DOM) */}
      <div className="pointer-events-none fixed inset-0">
        <ScrollVideo
          src="/brand/journey-loop.mp4"
          poster="/brand/journey-poster.webp"
          className="h-full w-full object-cover"
        />
        {/* Tom geral pra legibilidade — escurece bordas e topo/base */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/15 to-ink/75"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.45)_85%)]"
        />
      </div>
      <div className="relative">
        {/* CONTEÚDO */}

      {/* Top bar */}
      <header className="safe-top sticky top-0 z-20 border-b border-paper/10 bg-ink/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo tone="paper" />
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-[13px] font-medium text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper sm:inline-flex"
            >
              Sou motoboy
            </Link>
            <Link
              href="/loja/login"
              className="inline-flex items-center gap-1 rounded-lg bg-paper px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
            >
              Acesso da loja
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — texto deita por cima do vídeo */}
      <section className="relative">
        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-20 md:py-28">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Cockpit de delivery
          </span>
          <h1 className="mt-7 max-w-4xl text-[44px] font-semibold leading-[1.02] tracking-tighter2 text-paper md:text-[72px] lg:text-[88px]">
            Sua operação de delivery,
            <br />
            <span className="text-paper/55">sem planilha.</span>
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-paper/75">
            Cadastre seus motoboys, despache pedidos pelo app e feche o
            pagamento do mês com um botão. Feito pra restaurantes que rodam com
            frota própria.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/loja/login">
              <Button size="lg" variant="danger" className="gap-1.5 shadow-ember">
                Começar agora
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex h-12 items-center rounded-lg border border-paper/15 bg-paper/5 px-4 text-[15px] font-medium text-paper/85 backdrop-blur-sm transition-colors hover:bg-paper/10 hover:text-paper"
            >
              Como funciona →
            </Link>
          </div>

          {/* Metric strip flutua sobre o vídeo */}
          <dl className="mt-14 inline-grid w-fit max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-paper/15 bg-paper/[0.06] backdrop-blur-md">
            <Metric label="Pedidos / dia" value="48" />
            <Metric label="Motoboys" value="07" />
            <Metric label="A pagar" value="R$ 2.140" emphasis />
          </dl>
        </div>
      </section>

      {/* Features */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-14 max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
              Por que MotoEntrega
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tighter2 text-paper md:text-[44px]">
              O suficiente. Nada além.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/75">
              Foi feito pra rodar nas duas pontas: o tablet da cozinha e o
              celular do motoboy. Sem dashboards inúteis, sem onboarding de
              vinte telas.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
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
      <section id="como-funciona" className="relative">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
                Como funciona
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tighter2 text-paper md:text-[44px]">
                Três passos. É só isso.
              </h2>
            </div>
            <Link
              href="/loja/login"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-paper/85 hover:text-ember"
            >
              Pular pra cadastrar minha loja
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-2xl border border-paper/12 bg-paper/[0.08] backdrop-blur-md md:grid-cols-3">
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

      {/* Accountability — relatório falado em "voz" do app */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="space-y-5">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ember">
              Transparência por padrão
            </span>
            <h2 className="text-3xl font-semibold tracking-tighter2 text-paper md:text-[44px]">
              Cada centavo aparece de onde veio e pra onde vai.
            </h2>
            <p className="text-[15px] leading-relaxed text-paper/75">
              O motoboy abre o app e vê o que ganhou no dia, na semana, no mês.
              A loja abre o relatório e vê a mesma conta. Não tem versão da
              loja diferente da versão do motoboy.
            </p>
          </div>
          <div className="rounded-2xl border border-paper/12 bg-paper/[0.06] p-6 font-mono text-[13px] leading-relaxed text-paper/90 backdrop-blur-md">
            <div className="text-[10px] uppercase tracking-[0.2em] text-paper/45">
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
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h2 className="text-3xl font-semibold tracking-tighter2 text-paper md:text-[44px]">
            Pronto pra parar de fazer conta no caderno?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-paper/75">
            Cadastre sua loja em minutos. É grátis pra começar.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/loja/login">
              <Button size="lg" variant="danger" className="gap-1.5 shadow-ember">
                Criar conta de loja
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-lg border border-paper/15 bg-paper/5 px-4 text-[15px] font-medium text-paper/85 backdrop-blur-sm transition-colors hover:bg-paper/10 hover:text-paper"
            >
              Sou motoboy
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="safe-bottom relative border-t border-paper/10 bg-ink/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-[13px] text-paper/65 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo tone="paper" />
            <span className="hidden sm:inline">
              Operação de delivery, sem planilha.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/loja/login" className="hover:text-paper">
              Loja
            </Link>
            <Link href="/login" className="hover:text-paper">
              Motoboy
            </Link>
            <span className="text-paper/40">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
      </div>
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
    <div className="bg-ink/45 px-4 py-3 backdrop-blur-sm">
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-paper/45">
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? "mt-1 font-mono text-[15px] font-semibold text-ember"
            : "mt-1 font-mono text-[15px] font-semibold text-paper"
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
    <div className="rounded-2xl border border-paper/12 bg-ink/35 p-6 backdrop-blur-md transition-colors hover:bg-ink/55">
      <div className="font-mono text-[12px] text-paper/45">{num}</div>
      <h3 className="mt-3 text-[19px] font-semibold tracking-tightish text-paper">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-paper/70">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="relative bg-ink/35 p-6 backdrop-blur-sm">
      <div className="font-mono text-[12px] text-ember">Passo {n}</div>
      <h3 className="mt-2 text-[20px] font-semibold tracking-tightish text-paper">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-paper/70">{body}</p>
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
      <span className="text-paper/55">{label}</span>
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
