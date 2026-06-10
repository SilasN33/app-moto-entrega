import type { Metadata } from "next";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/sections/Hero";
import Problem from "@/components/landing/sections/Problem";
import HowItWorks from "@/components/landing/sections/HowItWorks";
import Apps from "@/components/landing/sections/Apps";
import Trust from "@/components/landing/sections/Trust";
import FinalCta from "@/components/landing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Brasa — Gestão de entregas para restaurantes",
  description:
    "Pedidos, motoboys, fotos de entrega e o acerto do fim do mês — tudo num só lugar. Acenda sua operação de entregas.",
};

export default function LandingPage() {
  return (
    <div
      id="landing-root"
      className="bg-brasa-warmwhite font-body text-brasa-charcoal"
    >
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Apps />
        <Trust />
        <FinalCta />
      </main>
    </div>
  );
}
