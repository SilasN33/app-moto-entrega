-- =====================================================================
-- Adiciona suporte a login por e-mail.
-- Antes: profiles.phone era NOT NULL.
-- Agora: phone e email opcionais, mas pelo menos UM dos dois é exigido.
-- =====================================================================

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  alter column phone drop not null;

-- Garante que o profile tenha pelo menos um meio de contato/login.
alter table public.profiles
  drop constraint if exists profiles_phone_or_email_chk;

alter table public.profiles
  add constraint profiles_phone_or_email_chk
  check (phone is not null or email is not null);

create index if not exists profiles_email_idx on public.profiles(email);

-- ---------------------------------------------------------------------
-- bootstrap_store_admin agora aceita email opcional.
-- Mantém compatibilidade: phone continua sendo o primeiro identificador.
-- ---------------------------------------------------------------------
create or replace function public.bootstrap_store_admin(
  p_user_id    uuid,
  p_store_name text,
  p_full_name  text,
  p_phone      text default null,
  p_email      text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  new_store_id uuid;
begin
  if p_phone is null and p_email is null then
    raise exception 'Informe ao menos phone ou email';
  end if;

  insert into public.stores(name) values (p_store_name) returning id into new_store_id;

  insert into public.profiles(id, store_id, role, full_name, phone, email)
  values (p_user_id, new_store_id, 'admin', p_full_name, p_phone, p_email)
  on conflict (id) do update
     set store_id  = excluded.store_id,
         role      = 'admin',
         full_name = excluded.full_name,
         phone     = coalesce(excluded.phone, public.profiles.phone),
         email     = coalesce(excluded.email, public.profiles.email);

  return new_store_id;
end $$;
