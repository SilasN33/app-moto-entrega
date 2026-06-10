"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brasa-warmwhite/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(30,27,25,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-3 w-3 rounded-full bg-gradient-to-tr from-brasa-ember to-brasa-golden shadow-[0_0_12px_2px_rgba(255,106,43,0.55)]"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-brasa-charcoal">
            brasa
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-brasa-charcoal/70 md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-brasa-charcoal">
            Como funciona
          </a>
          <a href="#apps" className="transition-colors hover:text-brasa-charcoal">
            O produto
          </a>
          <a href="#confianca" className="transition-colors hover:text-brasa-charcoal">
            Confiança
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-brasa-charcoal/60 transition-colors hover:text-brasa-charcoal sm:inline-block"
          >
            Sou motoboy
          </Link>
          <Link
            href="/loja/login"
            className="rounded-full bg-brasa-charcoal px-5 py-2 text-sm font-medium text-brasa-warmwhite transition-all duration-300 hover:bg-brasa-ember hover:shadow-[0_4px_24px_rgba(255,106,43,0.45)]"
          >
            Acesso da loja
          </Link>
        </div>
      </nav>
    </header>
  );
}
