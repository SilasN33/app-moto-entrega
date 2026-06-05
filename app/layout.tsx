import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motoentrega.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MotoEntrega — operação de delivery, sem planilha",
    template: "%s · MotoEntrega",
  },
  description:
    "Cadastre seus motoboys, despache pedidos, acompanhe entregas e feche o pagamento do mês em minutos. Feito pra restaurantes que rodam com frota própria.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "MotoEntrega",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MotoEntrega",
    title: "MotoEntrega — operação de delivery, sem planilha",
    description:
      "Cadastre seus motoboys, despache pedidos, acompanhe entregas e feche o pagamento do mês em minutos.",
    images: [
      {
        url: "/brand/og-card.png",
        width: 1200,
        height: 630,
        alt: "MotoEntrega — operação de delivery sem planilha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MotoEntrega — operação de delivery, sem planilha",
    description:
      "Cadastre motoboys, despache, acompanhe e feche o mês em minutos.",
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
