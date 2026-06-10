"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/landing-motion";

const APPS = [
  {
    badge: "Painel da loja",
    title: "O balcão de comando",
    features: [
      "Crie pedidos em segundos, com valor da corrida",
      "Cadastre e gerencie seus motoboys",
      "Registre descontos (cancelamentos, refeições)",
      "Relatório mensal pronto por motoboy",
    ],
    accent: "from-brasa-ember to-brasa-coral",
  },
  {
    badge: "App do motoboy",
    title: "A fila no bolso",
    features: [
      "Fila de pedidos em tempo real",
      "Puxa o pedido com um toque",
      "Foto da entrega como comprovante",
      "Total do mês sempre visível",
    ],
    accent: "from-brasa-coral to-brasa-golden",
  },
];

export default function Apps() {
  return (
    <section id="apps" className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brasa-ember">
          O produto
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brasa-charcoal sm:text-5xl">
          Dois apps. <span className="text-brasa-charcoal/40">Uma brasa só.</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brasa-charcoal/65">
          PWA instalável direto no celular — sem loja de aplicativos, sem fricção.
          A loja comanda, o motoboy executa, e os dois enxergam a mesma verdade.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {APPS.map((app, i) => (
          <motion.div
            key={app.badge}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: i * 0.12, ease: EASE_OUT }}
            className="group relative overflow-hidden rounded-3xl border border-brasa-charcoal/8 bg-white/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(30,27,25,0.1)] sm:p-10"
          >
            {/* glow de brasa no canto */}
            <span
              aria-hidden
              className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${app.accent} opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-30`}
            />
            <span
              className={`inline-block rounded-full bg-gradient-to-r ${app.accent} px-3.5 py-1 text-xs font-semibold text-white`}
            >
              {app.badge}
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-brasa-charcoal">
              {app.title}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {app.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-brasa-charcoal/70">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brasa-ember"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
