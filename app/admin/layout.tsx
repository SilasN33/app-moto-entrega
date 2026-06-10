import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
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
    <div className="min-h-dvh bg-paper">
      <header className="safe-top sticky top-0 z-20 border-b border-line/80 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Logo showWordmark={false} />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-4">
                Cockpit · {store?.name ?? "Loja"}
              </span>
              <span className="text-[15px] font-semibold tracking-tighter2 text-ink">
                {profile.full_name ?? "Operação"}
              </span>
            </div>
          </div>
          <form action="/api/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-32 pt-6">{children}</main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-line/80 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-3xl grid-cols-5 px-1.5 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[11px] font-medium text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
