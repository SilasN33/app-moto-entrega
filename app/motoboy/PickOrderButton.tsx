"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function PickOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick() {
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error, data } = await supabase
      .from("orders")
      .update({
        status: "picked",
        motoboy_id: user!.id,
        picked_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("status", "pending")
      .is("motoboy_id", null)
      .select("id")
      .maybeSingle();
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    if (!data) {
      setError("Esse pedido já foi pego por outro motoboy.");
      router.refresh();
      return;
    }
    router.push(`/motoboy/meus/${orderId}`);
    router.refresh();
  }

  return (
    <>
      <Button full onClick={pick} loading={loading}>
        Pegar este pedido
      </Button>
      {error && (
        <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{error}</p>
      )}
    </>
  );
}
