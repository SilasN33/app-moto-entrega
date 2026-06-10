"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Canvas só carrega quando (e se) for usado — nunca no critical path
const EmberRouteScene = dynamic(() => import("../canvas/EmberRouteScene"), {
  ssr: false,
  loading: () => null,
});

const STEPS = [
  {
    n: "01",
    title: "A loja cria o pedido",
    text: "Endereço, valor da corrida, observações. Dez segundos e o pedido já está na fila — aceso e visível para todos os motoboys.",
  },
  {
    n: "02",
    title: "O motoboy puxa da fila",
    text: "No celular dele, sem ligação e sem grito. Quem está livre pega o próximo. A fila anda sozinha.",
  },
  {
    n: "03",
    title: "Entregou, fotografou",
    text: "A entrega só fecha com foto. O comprovante fica guardado no pedido — para sempre, para os dois lados.",
  },
  {
    n: "04",
    title: "O mês fecha sozinho",
    text: "Cada entrega vira uma linha no relatório. No fim do mês, você sabe exatamente quanto pagar a cada motoboy. Sem planilha.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<"pending" | "canvas" | "static">("pending");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(desktop && !reduced ? "canvas" : "static");
  }, []);

  useEffect(() => {
    if (mode !== "canvas" || !sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      // ~2.4 viewports pinados: o suficiente pra história, sem prender o usuário
      end: "+=240%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const step = Math.min(3, Math.floor(self.progress * 4.35));
        setActiveStep((s) => (s === step ? s : step));
      },
    });
    // O pin nasce num 2º render (depois do setMode) — triggers criados antes
    // dele guardaram posições sem o pin spacer. Recalcula tudo.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, [mode]);

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {mode === "canvas" ? (
        <div className="flex h-screen flex-col">
          <div className="mx-auto w-full max-w-6xl px-8 pt-24">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brasa-ember">
              Como funciona
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brasa-charcoal sm:text-4xl">
              Um pedido. Uma fagulha. <span className="text-brasa-charcoal/40">Acompanhe.</span>
            </h2>
          </div>

          {/* Cena 3D — a fagulha percorre a rota conforme o scroll */}
          <div className="relative min-h-0 flex-1">
            <EmberRouteScene progressRef={progressRef} />
          </div>

          {/* Legenda do passo ativo */}
          <div className="mx-auto w-full max-w-6xl px-8 pb-14">
            <div className="relative h-28 max-w-md">
              {STEPS.map((step, i) => (
                <div
                  key={step.n}
                  aria-hidden={activeStep !== i}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeStep === i
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <span className="font-display text-sm font-semibold text-brasa-ember">
                    {step.n}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-brasa-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brasa-charcoal/60">
                    {step.text}
                  </p>
                </div>
              ))}
              {/* progresso */}
              <div className="absolute -left-10 top-1 hidden flex-col gap-2 xl:flex">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeStep >= i ? "w-6 bg-brasa-ember" : "w-3 bg-brasa-charcoal/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / reduced-motion: experiência deliberada, não o desktop quebrado */
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brasa-ember">
            Como funciona
          </p>
          <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight text-brasa-charcoal sm:text-4xl">
            Um pedido. Uma fagulha. Acompanhe.
          </h2>

          <div className="relative mt-12 flex flex-col gap-10 pl-8">
            {/* rota vertical */}
            <span
              aria-hidden
              className="absolute bottom-4 left-[5px] top-2 w-0.5 bg-gradient-to-b from-brasa-ember via-brasa-coral to-brasa-golden"
            />
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="absolute -left-8 top-1.5 h-3 w-3 rounded-full bg-brasa-ember shadow-[0_0_10px_2px_rgba(255,106,43,0.5)]"
                />
                <span className="font-display text-sm font-semibold text-brasa-ember">
                  {step.n}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-brasa-charcoal">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-brasa-charcoal/60">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
