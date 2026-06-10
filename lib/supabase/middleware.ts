import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/verify" ||
    pathname === "/" ||
    pathname === "/loja/login" ||
    pathname === "/loja/redefinir-senha";

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/brand") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico";

  if (isPublicAsset) return supabaseResponse;

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Já logado tentando ver tela de login → manda pro painel certo.
  // Exceção: /loja/redefinir-senha pode ser acessada logado (fluxo de reset).
  // "/" fica fora: é a landing pública — logado ou não, todo mundo pode ver.
  const isLoginScreen =
    pathname === "/login" ||
    pathname === "/verify" ||
    pathname === "/loja/login";

  if (user && isLoginScreen) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === "admin" ? "/admin" : "/motoboy";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
