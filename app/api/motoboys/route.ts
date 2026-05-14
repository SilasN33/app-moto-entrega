import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toE164BR } from "@/lib/utils";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: me } = await supabase
    .from("profiles")
    .select("role, store_id")
    .eq("id", user.id)
    .single();

  if (!me || me.role !== "admin")
    return NextResponse.json({ error: "Apenas admin" }, { status: 403 });

  const body = await req.json();
  const fullName = String(body.full_name ?? "").trim();
  const rawPhone = String(body.phone ?? "").trim();
  const rawEmail = String(body.email ?? "").trim().toLowerCase();
  const phone = rawPhone ? toE164BR(rawPhone) : null;
  const email = rawEmail || null;

  if (!fullName)
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  if (!phone && !email)
    return NextResponse.json(
      { error: "Informe ao menos telefone ou e-mail" },
      { status: 400 }
    );

  const admin = createAdminClient();

  // 1) Tenta criar o usuário no Auth
  const createPayload: Record<string, unknown> = {
    user_metadata: { full_name: fullName },
  };
  if (phone) {
    createPayload.phone = phone;
    createPayload.phone_confirm = true;
  }
  if (email) {
    createPayload.email = email;
    createPayload.email_confirm = true;
  }

  const { data: created, error: createErr } =
    await admin.auth.admin.createUser(createPayload);

  let userId = created?.user?.id;

  if (createErr) {
    // Se já existir, busca pelo identificador disponível
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list?.users.find((u) => {
      if (email && u.email?.toLowerCase() === email) return true;
      if (phone && u.phone === phone.replace("+", "")) return true;
      return false;
    });
    if (!existing)
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    userId = existing.id;
  }

  if (!userId)
    return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 });

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: userId,
    store_id: me.store_id,
    role: "motoboy",
    full_name: fullName,
    phone,
    email,
    active: true,
  });

  if (profileErr)
    return NextResponse.json({ error: profileErr.message }, { status: 400 });

  return NextResponse.json({ ok: true, id: userId });
}
