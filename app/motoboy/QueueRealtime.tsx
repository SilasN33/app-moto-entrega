"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Assina alterações na tabela orders e dispara router.refresh()
 * quando entra/sai pedido da fila pública. RLS já filtra por store_id.
 */
export function QueueRealtime() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("motoboy-queue")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const next = payload.new as { status?: string; motoboy_id?: string | null };
          const prev = payload.old as { status?: string; motoboy_id?: string | null };
          if (
            next?.status !== prev?.status ||
            next?.motoboy_id !== prev?.motoboy_id
          ) {
            router.refresh();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
