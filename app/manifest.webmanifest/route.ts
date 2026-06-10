import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Brasa",
    short_name: "Brasa",
    description:
      "Cockpit de delivery pra restaurante com frota própria. Sem comissão de marketplace.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#E5481C",
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
