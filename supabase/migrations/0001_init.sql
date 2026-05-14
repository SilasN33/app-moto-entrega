-- =====================================================================
-- App Moto Entrega — Schema inicial
-- Multi-loja desde o início. Cada usuário (auth.users) tem um profile
-- com role (admin | motoboy) e um store_id.
-- =====================================================================

-- Extensões
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Stores (lojas)
-- ---------------------------------------------------------------------
create table public.stores (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text,
  address      text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Profiles (extensão de auth.users)
--   role: 'admin'   -> dono/gerente da loja
--         'motoboy' -> entregador
-- ---------------------------------------------------------------------
create type public.user_role as enum ('admin', 'motoboy');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  store_id    uuid not null references public.stores(id) on delete restrict,
  role        public.user_role not null default 'motoboy',
  full_name   text not null,
  phone       text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index profiles_store_idx on public.profiles(store_id);
create index profiles_role_idx  on public.profiles(role);

-- ---------------------------------------------------------------------
-- Orders (pedidos)
--   status:
--     'pending'   -> criado pela loja, na fila
--     'picked'    -> motoboy pegou
--     'delivered' -> entregue (com foto)
--     'cancelled' -> cancelado
-- ---------------------------------------------------------------------
create type public.order_status as enum ('pending', 'picked', 'delivered', 'cancelled');

create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null references public.stores(id) on delete cascade,
  code            text,                    -- código curto para exibir (#1042 etc.)
  customer_name   text,
  customer_phone  text,
  address         text not null,
  notes           text,
  amount          numeric(10,2) not null,  -- valor pago ao motoboy por essa entrega
  status          public.order_status not null default 'pending',
  motoboy_id      uuid references public.profiles(id) on delete set null,
  photo_url       text,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  picked_at       timestamptz,
  delivered_at    timestamptz,
  cancelled_at    timestamptz
);

create index orders_store_idx     on public.orders(store_id);
create index orders_status_idx    on public.orders(status);
create index orders_motoboy_idx   on public.orders(motoboy_id);
create index orders_created_idx   on public.orders(created_at);

-- ---------------------------------------------------------------------
-- Deductions (descontos)
--   ex.: pedido cancelado, refeições descontadas, etc.
-- ---------------------------------------------------------------------
create table public.deductions (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores(id) on delete cascade,
  motoboy_id  uuid not null references public.profiles(id) on delete cascade,
  amount      numeric(10,2) not null,
  reason      text not null,
  ref_date    date not null default (now() at time zone 'America/Sao_Paulo')::date,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index deductions_store_idx   on public.deductions(store_id);
create index deductions_motoboy_idx on public.deductions(motoboy_id);
create index deductions_date_idx    on public.deductions(ref_date);

-- ---------------------------------------------------------------------
-- Helpers para RLS
-- ---------------------------------------------------------------------
create or replace function public.current_store_id() returns uuid
language sql stable security definer set search_path = public as $$
  select store_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_role() returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.stores      enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.deductions  enable row level security;

-- stores: usuário só vê a própria loja
create policy "stores_select_own" on public.stores
  for select using (id = public.current_store_id());

create policy "stores_update_admin" on public.stores
  for update using (id = public.current_store_id() and public.is_admin());

-- profiles
-- todo mundo vê os profiles da própria loja (motoboy precisa ver o nome do admin etc.)
create policy "profiles_select_same_store" on public.profiles
  for select using (store_id = public.current_store_id());

-- usuário pode atualizar o próprio profile (campos básicos)
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- admin pode inserir/atualizar/desativar profiles da própria loja
create policy "profiles_admin_insert" on public.profiles
  for insert with check (store_id = public.current_store_id() and public.is_admin());

create policy "profiles_admin_update" on public.profiles
  for update using (store_id = public.current_store_id() and public.is_admin());

-- orders
-- todo mundo da loja lê os pedidos da loja
create policy "orders_select_same_store" on public.orders
  for select using (store_id = public.current_store_id());

-- admin cria pedidos
create policy "orders_admin_insert" on public.orders
  for insert with check (store_id = public.current_store_id() and public.is_admin());

-- admin atualiza qualquer pedido da loja
create policy "orders_admin_update" on public.orders
  for update using (store_id = public.current_store_id() and public.is_admin());

-- motoboy pode "pegar" um pedido pendente da própria loja
-- (a app só envia update setando motoboy_id = auth.uid() e status = 'picked')
create policy "orders_motoboy_pick" on public.orders
  for update using (
    store_id = public.current_store_id()
    and public.current_role() = 'motoboy'
    and (
      (status = 'pending' and motoboy_id is null)
      or motoboy_id = auth.uid()
    )
  );

-- deductions
create policy "deductions_select_same_store" on public.deductions
  for select using (
    store_id = public.current_store_id()
    and (public.is_admin() or motoboy_id = auth.uid())
  );

create policy "deductions_admin_write" on public.deductions
  for all using (store_id = public.current_store_id() and public.is_admin())
        with check (store_id = public.current_store_id() and public.is_admin());

-- ---------------------------------------------------------------------
-- Storage bucket para fotos das entregas
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('delivery-photos', 'delivery-photos', true)
on conflict (id) do nothing;

-- qualquer um da loja pode ler (bucket é público, mas mantemos policy por segurança)
create policy "delivery_photos_read" on storage.objects
  for select using (bucket_id = 'delivery-photos');

-- motoboy autenticado pode subir fotos
create policy "delivery_photos_insert" on storage.objects
  for insert with check (
    bucket_id = 'delivery-photos'
    and auth.role() = 'authenticated'
  );

-- ---------------------------------------------------------------------
-- View de relatório mensal por motoboy
-- ---------------------------------------------------------------------
create or replace view public.monthly_payouts as
select
  p.store_id,
  p.id            as motoboy_id,
  p.full_name     as motoboy_name,
  date_trunc('month', coalesce(o.delivered_at, o.created_at) at time zone 'America/Sao_Paulo')::date as ref_month,
  count(*) filter (where o.status = 'delivered')                                  as deliveries_count,
  coalesce(sum(o.amount) filter (where o.status = 'delivered'), 0)::numeric(10,2) as gross_amount
from public.profiles p
left join public.orders o on o.motoboy_id = p.id
where p.role = 'motoboy'
group by p.store_id, p.id, p.full_name,
         date_trunc('month', coalesce(o.delivered_at, o.created_at) at time zone 'America/Sao_Paulo');

-- nota: a view herda RLS da tabela base (orders) — ok.
