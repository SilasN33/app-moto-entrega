"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/landing-motion";

const ITEMS = [
  {
    title: "Cada loja vê só o que é dela",
    text: "Segurança em nível de banco de dados (Row Level Security). Multi-loja desde o primeiro dia — seus dados nunca se misturam.",
  },
  {
    title: "Foto é comprovante",
    text: "Toda entrega fecha com foto, guardada junto do pedido. Discussão de “entreguei / não entregou” acaba aqui.",
  },
  {
    title: "O acerto não é mais uma briga",
    text: "Entregas menos descontos, por motoboy, por mês. O relatório nasce pronto — é só pagar.",
  },
];

export default function Trust() {
  return (
    <section id="confianca" className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="lg:sticky lg:top-28"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brasa-ember">
            Confiança
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brasa-charcoal sm:text-5xl">
            Quente por fora,
            <br />
            <span className="text-brasa-charcoal/40">sólido por dentro.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_OUT }}
              className="rounded-3xl border border-brasa-charcoal/8 bg-white/50 p-7 backdrop-blur-sm sm:p-8"
            >
              <h3 className="font-display text-lg font-semibold text-brasa-charcoal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brasa-charcoal/60">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
