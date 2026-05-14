import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Moto Entrega",
    short_name: "Moto Entrega",
    description: "Gestão de entregas e pagamento de motoboys",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#ea580c",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
}
