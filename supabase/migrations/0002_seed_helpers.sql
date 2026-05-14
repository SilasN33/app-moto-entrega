-- =====================================================================
-- Helpers para criar a primeira loja + admin manualmente.
-- Use isso UMA VEZ depois que você criar o usuário admin no Auth do
-- Supabase (via SMS OTP ou painel "Add user").
-- =====================================================================

-- Função para promover um usuário a admin de uma loja nova.
-- Uso (no SQL editor do Supabase):
--
--   select public.bootstrap_store_admin(
--     p_user_id  => '<UUID do usuário em auth.users>',
--     p_store_name => 'Minha Loja',
--     p_full_name  => 'Silas',
--     p_phone      => '+5511999999999'
--   );
--
create or replace function public.bootstrap_store_admin(
  p_user_id    uuid,
  p_store_name text,
  p_full_name  text,
  p_phone      text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  new_store_id uuid;
begin
  insert into public.stores(name) values (p_store_name) returning id into new_store_id;

  insert into public.profiles(id, store_id, role, full_name, phone)
  values (p_user_id, new_store_id, 'admin', p_full_name, p_phone)
  on conflict (id) do update
     set store_id = excluded.store_id,
         role     = 'admin',
         full_name = excluded.full_name,
         phone    = excluded.phone;

  return new_store_id;
end $$;
