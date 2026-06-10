import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motoentrega.app";

// Fontes da landing (display/body) — o app usa Geist via font-sans/font-mono
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brasa — frota própria, sem intermediário",
    template: "%s · Brasa",
  },
  description:
    "Cockpit de delivery pra restaurante que entrega com motoboy próprio. Despache, acompanhe e feche o mês — sem comissão de marketplace, sem alugar app por entrega.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Brasa",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Brasa",
    title: "Brasa — frota própria, sem intermediário",
    description:
      "Cockpit de delivery pra restaurante que entrega com motoboy próprio. Sem comissão de marketplace.",
    images: [
      {
        url: "/brand/og-card.png",
        width: 1200,
        height: 630,
        alt: "Brasa — frota própria, sem intermediário",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasa — frota própria, sem intermediário",
    description:
      "Cockpit de delivery pra restaurante com frota própria. Sem comissão de marketplace.",
    images: ["/brand/og-card.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${sora.variable} ${inter.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
