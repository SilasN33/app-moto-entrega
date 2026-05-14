import { createClient } from "@supabase/supabase-js";

// Cliente com service-role key. NUNCA usar no browser.
// Use só em route handlers / server actions.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
