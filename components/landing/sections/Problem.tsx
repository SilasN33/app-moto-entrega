"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/landing-motion";

const PAINS = [
  {
    title: "Pedido no grito",
    text: "O pedido sai no WhatsApp, no papel ou na memória. Quando a casa enche, alguém esquece — e quem paga é o cliente.",
  },
  {
    title: "Acerto no escuro",
    text: "Fim do mês, planilha aberta, e a pergunta de sempre: quantas entregas cada motoboy fez mesmo? Ninguém tem certeza.",
  },
  {
    title: "Entrega sem prova",
    text: "“Entreguei sim.” Será? Sem foto, sem registro, a palavra de um contra a do outro.",
  },
];

export default function Problem() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-brasa-charcoal sm:text-5xl"
      >
        Sua operação ainda vive
        <span className="text-brasa-charcoal/40"> numa planilha fria?</span>
      </motion.h2>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {PAINS.map((pain, i) => (
          <motion.div
            key={pain.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT }}
            className="group rounded-3xl border border-brasa-charcoal/8 bg-white/50 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brasa-ember/25 hover:shadow-[0_16px_48px_rgba(255,106,43,0.12)]"
          >
            <span className="mb-5 block h-1.5 w-8 rounded-full bg-brasa-charcoal/15 transition-all duration-300 group-hover:w-12 group-hover:bg-brasa-ember" />
            <h3 className="font-display text-lg font-semibold text-brasa-charcoal">
              {pain.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-brasa-charcoal/60">
              {pain.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
