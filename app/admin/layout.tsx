import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  ClipboardList,
  Plus,
  Users,
  Receipt,
  BarChart3,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/novo", label: "Novo", icon: Plus },
  { href: "/admin/motoboys", label: "Motoboys", icon: Users },
  { href: "/admin/descontos", label: "Descontos", icon: Receipt },
  { href: "/admin/relatorio", label: "Relatório", icon: BarChart3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("name")
    .eq("id", profile.store_id)
    .maybeSingle();

  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="safe-top sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Admin
            </p>
            <h1 className="text-lg font-bold">{store?.name ?? "Loja"}</h1>
          </div>
          <form action="/api/logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1 text-sm text-neutral-600"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-4">{children}</main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-3xl grid-cols-5 px-1 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
