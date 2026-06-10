"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/landing-motion";

const HEADLINE = ["Acenda", "sua", "operação", "de", "entregas."];

const CITY_ALT =
  "Cidade em miniatura da Brasa, com rotas de entrega acesas em laranja durante o pôr do sol";

/**
 * Vídeo loop orbital da cidade (bíblia BRASA, storyboard SB-3) com o key frame
 * como poster. Quem prefere movimento reduzido (ou está no mobile, onde o vídeo
 * pesa na rede) recebe a imagem estática — uma escolha, não uma degradação.
 */
function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setPlayVideo(!reduced && desktop);
  }, []);

  if (!playVideo) {
    return (
      <Image
        src="/assets/landing/hero-city.webp"
        alt={CITY_ALT}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_72%]"
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/landing/hero-city.webp"
      aria-label={CITY_ALT}
      className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
    >
      <source src="/assets/landing/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: EASE_OUT },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Texto — ocupa o espaço negativo no topo do key frame */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-32 text-center sm:px-8 sm:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-5 rounded-full border border-brasa-charcoal/10 bg-brasa-warmwhite/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-brasa-charcoal/60 backdrop-blur"
        >
          Gestão de entregas para restaurantes
        </motion.p>

        <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-tight text-brasa-charcoal sm:text-6xl lg:text-7xl">
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`inline-block ${
                  word === "Acenda"
                    ? "bg-gradient-to-r from-brasa-ember to-brasa-coral bg-clip-text text-transparent"
                    : ""
                }`}
              >
                {word}
              </motion.span>
              {i < HEADLINE.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-brasa-charcoal/65 sm:text-lg"
        >
          Pedidos, motoboys, fotos de entrega e o acerto do fim do mês —
          tudo num só lugar. Sem planilha, sem grito, sem esquecimento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/login"
            className="group rounded-full bg-brasa-ember px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(255,106,43,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(255,106,43,0.6)]"
          >
            Começar agora
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href="#como-funciona"
            className="rounded-full border border-brasa-charcoal/15 bg-brasa-warmwhite/60 px-7 py-3.5 text-sm font-medium text-brasa-charcoal backdrop-blur transition-all duration-300 hover:border-brasa-charcoal/30"
          >
            Ver como funciona
          </a>
        </motion.div>
      </div>

      {/* Cidade diorama — key frame BRASA (vídeo loop entra como drop-in) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE_OUT }}
        className="pointer-events-none relative mt-8 flex-1"
      >
        <div className="absolute inset-x-0 bottom-0 top-0">
          <HeroMedia />
          {/* Fusão do diorama com o fundo warm white da página */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brasa-warmwhite to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brasa-warmwhite to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
