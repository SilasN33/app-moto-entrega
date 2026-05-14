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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        value ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {value ? "Ativo" : "Inativo"}
    </button>
  );
}
