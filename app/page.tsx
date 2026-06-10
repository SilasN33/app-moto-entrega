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
  title: "Brasa — frota própria, sem intermediário",
  description:
    "Cockpit de delivery pra restaurante que já tem motoboy. Despache pelo app, acompanhe a entrega e feche o mês — sem comissão de marketplace, sem alugar app por entrega.",
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
