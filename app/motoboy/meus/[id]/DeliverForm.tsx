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
      <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-3">
        Confirmar entrega
      </p>

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
          className="aspect-square w-full rounded-lg border border-line object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-paper-2 text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2"
        >
          <Camera className="h-7 w-7" strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Tirar foto da entrega</span>
        </button>
      )}

      {preview && (
        <Button
          type="button"
          variant="outline"
          full
          onClick={() => fileInput.current?.click()}
        >
          Trocar foto
        </Button>
      )}

      {error && (
        <p className="rounded-md border border-ember/30 bg-ember-weak px-3 py-2 text-[12px] text-ember">
          {error}
        </p>
      )}

      <Button full size="lg" onClick={deliver} loading={loading} disabled={!file}>
        Marcar como entregue
      </Button>
    </Card>
  );
}
