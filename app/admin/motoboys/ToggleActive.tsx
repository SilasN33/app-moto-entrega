"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ToggleActive({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      await supabase.from("profiles").update({ active: next }).eq("id", id);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium tracking-tightish transition-colors disabled:opacity-50 ${
        value
          ? "bg-status-delivered-bg text-status-delivered"
          : "bg-paper-2 text-ink-4"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          value ? "bg-status-delivered" : "bg-ink-4"
        }`}
      />
      {value ? "Ativo" : "Inativo"}
    </button>
  );
}
