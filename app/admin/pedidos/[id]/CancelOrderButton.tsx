"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function cancel() {
    if (!confirm("Cancelar este pedido?")) return;
    setLoading(true);
    await supabase
      .from("orders")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", orderId);
    setLoading(false);
    router.refresh();
  }

  return (
    <Button variant="danger" full onClick={cancel} loading={loading}>
      Cancelar pedido
    </Button>
  );
}
