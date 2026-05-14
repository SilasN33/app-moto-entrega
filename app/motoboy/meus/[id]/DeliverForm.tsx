"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Camera } from "lucide-react";

export function DeliverForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function deliver() {
    if (!file) {
      setError("Tire ou selecione uma foto da entrega.");
      return;
    }
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${user!.id}/${orderId}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("delivery-photos")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (upErr) {
      setLoading(false);
      setError(upErr.message);
      return;
    }

    const { data: pub } = supabase.storage
      .from("delivery-photos")
      .getPublicUrl(path);

    const { error: updErr } = await supabase
      .from("orders")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
        photo_url: pub.publicUrl,
      })
      .eq("id", orderId);

    setLoading(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    router.push("/motoboy/meus");
    router.refresh();
  }

  return (
    <Card className="space-y-3">
      <p className="text-sm font-medium">Confirmar entrega</p>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPick}
      />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="aspect-square w-full rounded-xl object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500"
        >
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium">Tirar foto da entrega</span>
        </button>
      )}

      {preview && (
        <Button
          type="button"
          variant="secondary"
          full
          onClick={() => fileInput.current?.click()}
        >
          Trocar foto
        </Button>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{error}</p>
      )}

      <Button full onClick={deliver} loading={loading} disabled={!file}>
        Marcar como entregue
      </Button>
    </Card>
  );
}
