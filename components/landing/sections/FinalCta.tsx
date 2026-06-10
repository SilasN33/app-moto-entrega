"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/landing-motion";

// Constelação de pedidos (conceito C6 da bíblia) — posições fixas, sem random
const EMBERS: Array<[number, number, number]> = [
  [8, 22, 3], [18, 64, 2], [27, 38, 4], [36, 75, 2.5], [44, 18, 3],
  [55, 52, 2], [63, 30, 3.5], [71, 70, 2], [80, 44, 3], [90, 24, 2.5],
  [14, 85, 2], [48, 88, 2], [85, 80, 3], [95, 58, 2],
];

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  // A página inteira escurece para Charcoal Night quando o final entra em cena.
  // IntersectionObserver em vez de ScrollTrigger: a seção fica abaixo do pin
  // do como-funciona e o cálculo de offset do spacer não é confiável ali.
  useEffect(() => {
    const root = document.getElementById("landing-root");
    const section = sectionRef.current;
    if (!root || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        const dark = entry.intersectionRatio > 0.18;
        document.body.classList.toggle("nav-on-dark", dark);
        gsap.to(root, {
          backgroundColor: dark ? "#1E1B19" : "#F4EDE4",
          duration: reduced ? 0 : 1.1,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      },
      { threshold: [0, 0.18, 0.35] }
    );
    io.observe(section);
    return () => {
      io.disconnect();
      document.body.classList.remove("nav-on-dark");
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="relative mx-auto flex min-h-[90svh] max-w-6xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        {/* constelação */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {EMBERS.map(([x, y, size], i) => (
            <span
              key={i}
              className="absolute rounded-full bg-brasa-ember"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                boxShadow: `0 0 ${size * 4}px ${size}px rgba(255,106,43,0.4)`,
                animation: `ember-pulse 3.2s ease-in-out ${i * 0.35}s infinite`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          aria-hidden
          className="mb-8 h-5 w-5 rounded-full bg-gradient-to-tr from-brasa-ember to-brasa-golden shadow-[0_0_40px_8px_rgba(255,106,43,0.55)]"
        />

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-brasa-warmwhite sm:text-6xl"
        >
          Pronto para{" "}
          <span className="bg-gradient-to-r from-brasa-ember to-brasa-golden bg-clip-text text-transparent">
            acender
          </span>
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 max-w-md text-base leading-relaxed text-brasa-warmwhite/55"
        >
          Sua operação de entregas organizada hoje — e o fim do mês sem planilha,
          pela primeira vez.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/login"
            className="group mt-10 inline-block rounded-full bg-brasa-ember px-9 py-4 text-sm font-semibold text-white shadow-[0_8px_40px_rgba(255,106,43,0.5)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_12px_56px_rgba(255,106,43,0.7)]"
          >
            Entrar na Brasa
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>

      <footer className="relative border-t border-brasa-warmwhite/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-brasa-warmwhite/40 sm:flex-row sm:px-8">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-gradient-to-tr from-brasa-ember to-brasa-golden"
            />
            <span className="font-display font-semibold text-brasa-warmwhite/70">brasa</span>
          </span>
          <span>Gestão de entregas para restaurantes · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </section>
  );
}
