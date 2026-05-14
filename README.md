# Moto Entrega 🛵

App de gestão de entregas de restaurante. Loja cria pedidos com valor pago ao motoboy → motoboys puxam da fila → entregam → enviam foto → no fim do mês sai o relatório de quanto pagar para cada um.

## Stack
- **Next.js 15** (App Router) + **TypeScript** + **Tailwind**
- **Supabase**: Auth (OTP por SMS **ou e-mail**), Postgres com RLS, Storage (fotos das entregas)
- **PWA** (manifest + ícones) — pronto para virar app iOS depois via Capacitor
- Deploy: **Vercel**

## Estrutura

```
app/
  login/                  → tela de login (telefone + OTP)
  admin/                  → painel da loja (admin)
    page.tsx              → lista de pedidos
    novo/                 → criar pedido
    pedidos/[id]/         → detalhes do pedido (com foto)
    motoboys/             → cadastro de motoboys
    descontos/            → registrar descontos
    relatorio/            → relatório mensal por motoboy
  motoboy/                → app do motoboy
    page.tsx              → fila de pedidos
    meus/                 → pedidos em andamento + total do mês
    meus/[id]/            → detalhe + foto + marcar entregue
    perfil/               → resumo do mês
  api/
    motoboys/             → cadastro de motoboy (usa service-role)
    logout/

lib/
  supabase/{client,server,middleware,admin}.ts
  auth.ts                 → guards de role (requireAdmin, requireMotoboy)
  utils.ts                → formatBRL, formatPhoneBR, toE164BR
  types.ts

components/ui/            → Button, Input, Card, StatusBadge

supabase/migrations/      → SQL do schema (rodar no painel do Supabase)
```

## Modelo de dados
- `stores` — lojas (multi-loja desde o início).
- `profiles` — extensão de `auth.users`. Tem `role` (`admin` | `motoboy`), `store_id`, `phone` e `email` (pelo menos um deles obrigatório).
- `orders` — pedidos. `status`: `pending → picked → delivered` (ou `cancelled`).
- `deductions` — descontos por motoboy (pedidos cancelados, refeições, etc.).
- `monthly_payouts` — view de totais por motoboy/mês.

Tudo protegido por **Row Level Security**: cada usuário só enxerga dados da própria loja.

---

## 1) Setup local

```bash
npm install
cp .env.example .env.local
```

Edite `.env.local` com as chaves do seu projeto Supabase (passo abaixo).

```bash
npm run dev
```

App em `http://localhost:3000`.

## 2) Criar projeto Supabase

1. Em https://supabase.com → **New project**.
2. Em **Project settings → API**, copie para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (segredo — nunca exponha no front)

## 3) Rodar as migrations

No painel do Supabase → **SQL Editor**, execute **em ordem**:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_seed_helpers.sql`
3. `supabase/migrations/0003_add_email.sql` ← adiciona suporte a login por e-mail

Isso cria as tabelas, RLS, o bucket `delivery-photos` e a função `bootstrap_store_admin`.

> Já rodou `0001` e `0002` antes? Sem problema, basta rodar agora a `0003`.

## 4) Configurar autenticação (telefone e/ou e-mail)

A app aceita login por **telefone** OU **e-mail** — você pode habilitar os dois ou só um.

### a) E-mail (mais simples para começar)

Já vem habilitado por padrão. Em **Authentication → Providers → Email**:

- Mantenha **Email** habilitado.
- Habilite **"Enable Email OTP"** (envia código de 6 dígitos em vez de magic link). A app foi construída para o fluxo de OTP.
- Em **Authentication → Email Templates → Magic Link**, ajuste o template do e-mail se quiser. O `{{ .Token }}` é o código.
- Em **URL Configuration**, defina `Site URL` = sua URL final (ex.: `https://meudominio.vercel.app` ou `http://localhost:3000` no dev).

> Por padrão o Supabase usa o serviço de e-mail interno (limitado a poucos por hora). Para produção real, configure SMTP em **Project Settings → Auth → SMTP Settings** (Resend, SendGrid, etc.).

### b) Telefone (SMS)

Em **Authentication → Providers → Phone**:

- Habilite **Phone**.
- Escolha um provider (Twilio é o mais comum). Cole o `Account SID`, `Auth Token` e o número remetente.

> Para testar sem SMS real, crie usuários direto pelo painel "Add user" com phone.

## 5) Criar a primeira loja + admin

1. Em **Authentication → Users → Add user**, crie um usuário com seu **telefone** (`+5511999999999`) e/ou **e-mail**. Marque "Auto Confirm".
2. Copie o UUID dele.
3. No **SQL Editor**:

```sql
-- Pode informar phone, email, ou ambos (pelo menos um é obrigatório)
select public.bootstrap_store_admin(
  p_user_id    => '<UUID-COPIADO>',
  p_store_name => 'Minha Loja',
  p_full_name  => 'Seu Nome',
  p_phone      => '+5511999999999',  -- opcional
  p_email      => 'voce@exemplo.com'  -- opcional
);
```

Pronto: você é admin da loja "Minha Loja". Faça login na app pelo telefone OU pelo e-mail (a tela tem um toggle).

### Acesso direto da loja (e-mail + senha)

Existe uma rota dedicada **`/loja/login`** com login por e-mail e senha (mais rápido que OTP no dia a dia da loja).

Para usar, defina uma senha para o seu user admin de uma destas formas:

- **Pelo painel do Supabase** → **Authentication → Users → clique no user → "Send password recovery"** (você recebe um e-mail com link → cai em `/loja/redefinir-senha`).
- **Ou via SQL** (mais rápido se for só você):
  ```sql
  -- substitua o e-mail e a senha
  update auth.users
     set encrypted_password = crypt('SuaSenhaForte123', gen_salt('bf'))
   where email = 'voce@seuemail.com';
  ```

Depois é só acessar `http://localhost:3000/loja/login` (ou a URL da Vercel + `/loja/login`).

Os motoboys continuam usando `/login` (telefone ou e-mail por OTP).

## 6) Cadastrar motoboys

Como admin → aba **Motoboys** → "Cadastrar motoboy". Informe nome e **telefone, e-mail ou os dois**. Na primeira vez que o motoboy entrar (por SMS ou e-mail), ele já cai como motoboy da sua loja.

## 7) Deploy no Vercel

1. Crie um repositório git e suba o código:
   ```bash
   git init
   git add .
   git commit -m "feat: app moto entrega"
   git remote add origin git@github.com:seu-usuario/app-moto-entrega.git
   git push -u origin main
   ```
2. Em https://vercel.com → **Import Project** → selecione o repo.
3. Em **Environment Variables**, adicione as três variáveis do `.env.local`.
4. Deploy. A URL gerada deve ser adicionada de volta em **Supabase → Auth → URL Configuration → Site URL**.

## 8) Caminho para iOS (App Store)

Quando quiser publicar nativo, instale o Capacitor por cima:

```bash
npm i @capacitor/core @capacitor/ios @capacitor/cli
npx cap init "Moto Entrega" com.suaempresa.motoentrega --web-dir=out
# next.config.ts: defina output: 'export' (modo estático) OU
# use Capacitor com servidor remoto apontando para a URL Vercel
npx cap add ios
npx cap copy
npx cap open ios
```

A interface já é mobile-first, com PWA (`manifest.webmanifest`), `safe-area-inset-*`, viewport `cover`, e `apple-touch-icon`. Pronta para virar app.

---

## Fluxo do dia a dia

**Loja (admin)**
- Cria pedido → define endereço + valor (R$ 5/10/14 ou outro).
- Acompanha fila e pedidos a caminho.
- Vê foto da entrega quando o motoboy confirma.
- Adiciona descontos quando houver erro/refeição.
- No fim do mês, abre **Relatório** → soma por motoboy: bruto − descontos = a pagar.

**Motoboy**
- Vê fila com endereço e valor.
- Toca em "Pegar este pedido" → vira "A caminho".
- Liga pro cliente / abre no mapa direto da tela.
- Tira foto + "Marcar como entregue".
- Vê quanto já ganhou no mês na aba "Meus" e "Perfil".

## Notas
- Valor da entrega é definido pela loja a cada pedido (igual à planilha original).
- Multi-loja já implementado via `store_id` + RLS — basta criar mais lojas via `bootstrap_store_admin`.
- Storage de fotos é público (URLs diretas para exibir no painel). Se quiser privado, troque `public: true` na migration por `false` e use `createSignedUrl` para exibir.
- Login: a UI já tem toggle **Telefone | E-mail**. Se você só quiser oferecer e-mail (mais barato e sem Twilio), basta deixar o provider Phone desligado — o usuário vai bater no toggle e usar e-mail.
