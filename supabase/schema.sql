-- ============================================================================
-- KP GOLD V20.0 — SCHEMA SUPABASE COMPLET
-- PostgreSQL + PostGIS · Row Level Security (RLS) · Triggers · Index GPS
-- ============================================================================

-- Extensions nécessaires
create extension if not exists postgis;
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm; -- recherche texte floue

-- ============================================================================
-- 1. UTILISATEURS
-- ============================================================================

create type user_role as enum ('client', 'pro', 'admin');
create type client_tier as enum ('gratuit', 'premium');

create table users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  phone text unique not null,
  email text unique,
  role user_role not null default 'client',
  client_tier client_tier not null default 'gratuit',
  client_tier_end_date timestamptz,
  avatar_url text,
  preferred_lang text default 'fr',
  country text,
  city text,
  location geography(Point, 4326),
  two_fa_enabled boolean default false,
  is_verified boolean default false,
  is_banned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_users_location on users using gist (location);
create index idx_users_role on users (role);

-- ============================================================================
-- 2. PROFESSIONNELS
-- ============================================================================

create type pro_plan as enum ('gratuit', 'pro_mensuel', 'pro_6mois', 'pro_max', 'essai');
create type kyc_status as enum ('non_soumis', 'en_attente', 'valide', 'refuse');

create table pros (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  business_name text not null,
  niche text not null,
  category text not null,
  description text,
  logo_url text,
  cover_photo_url text,
  photos text[] default '{}',
  video_url text,
  market_name text,
  stall_number text,
  location geography(Point, 4326) not null,
  country text not null,
  city text,
  opening_hours jsonb,
  is_24_7 boolean default false,
  plan pro_plan not null default 'gratuit',
  plan_end_date timestamptz,
  trial_used boolean default false,
  kyc_status kyc_status not null default 'non_soumis',
  kyc_document_url text,
  license_document_url text,
  is_verified boolean default false,
  badge text default 'aucun',
  followers_count int default 0,
  rating_avg numeric(2,1) default 0,
  rating_count int default 0,
  ranking_score numeric default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_pros_location on pros using gist (location);
create index idx_pros_niche on pros (niche);
create index idx_pros_category on pros (category);
create index idx_pros_ranking on pros (ranking_score desc);
create index idx_pros_name_trgm on pros using gin (business_name gin_trgm_ops);

-- ============================================================================
-- 3. PRODUITS / SERVICES / EMPLOIS
-- ============================================================================

create table products (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  title jsonb not null,
  description jsonb,
  price numeric(12,2),
  currency text default 'XAF',
  variants jsonb,
  stock int,
  is_local boolean default false,
  is_promo boolean default false,
  promo_price numeric(12,2),
  photos text[] default '{}',
  market_name text,
  stall_number text,
  gps geography(Point, 4326),
  views_count int default 0,
  clicks_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index idx_products_pro on products (pro_id);
create index idx_products_gps on products using gist (gps);

create table services (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  title jsonb not null,
  description jsonb,
  price numeric(12,2),
  duration_minutes int,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  title text not null,
  description text,
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  contract_type text,
  location geography(Point, 4326),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================================
-- 4. RESTAURANTS
-- ============================================================================

create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  cuisine_type text,
  menu jsonb,
  is_local boolean default false,
  created_at timestamptz default now()
);

-- ============================================================================
-- 5. SANTÉ
-- ============================================================================

create type health_type as enum ('pharmacie', 'clinique', 'hopital', 'laboratoire', 'dentiste', 'ambulance', 'infirmier', 'toilette');

create table health_centers (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid references pros(id) on delete cascade,
  type health_type not null,
  is_on_duty boolean default false,
  emergency_available boolean default false,
  services text[],
  location geography(Point, 4326) not null,
  created_at timestamptz default now()
);
create index idx_health_type on health_centers (type);
create index idx_health_location on health_centers using gist (location);

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  health_center_id uuid not null references health_centers(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text default 'confirme',
  notes text,
  created_at timestamptz default now()
);

create table vaccination_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  vaccine_name text not null,
  dose_number int,
  administered_at date,
  next_reminder_at date,
  document_url text
);

create table teleconsultations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  health_center_id uuid not null references health_centers(id) on delete cascade,
  status text default 'en_attente',
  video_room_url text,
  prescription_photo_url text,
  created_at timestamptz default now()
);

create table sos_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  location geography(Point, 4326) not null,
  status text default 'actif',
  created_at timestamptz default now()
);

-- ============================================================================
-- 6. MESSAGERIE
-- ============================================================================

create table chats (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references users(id) on delete cascade,
  pro_id uuid not null references pros(id) on delete cascade,
  last_message_at timestamptz default now(),
  unique (client_id, pro_id)
);

create type message_type as enum ('texte', 'photo', 'audio', 'position');

create table messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid not null references chats(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  type message_type not null default 'texte',
  content text,
  location geography(Point, 4326),
  is_draft boolean default false,
  is_read boolean default false,
  translated_content jsonb,
  created_at timestamptz default now()
);
create index idx_messages_chat on messages (chat_id, created_at);

-- ============================================================================
-- 7. AVIS / RÉPUTATION
-- ============================================================================

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  photos text[] default '{}',
  pro_reply text,
  pro_reply_at timestamptz,
  is_flagged boolean default false,
  flagged_reason text,
  created_at timestamptz default now(),
  unique (pro_id, user_id)
);
create index idx_reviews_pro on reviews (pro_id);

-- ============================================================================
-- 8. ABONNEMENTS / PAIEMENTS / BOOSTS
-- ============================================================================

create type subscription_target as enum ('client', 'pro');

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  target subscription_target not null,
  plan text not null,
  amount numeric(12,2) not null,
  start_date timestamptz default now(),
  end_date timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index idx_subscriptions_user on subscriptions (user_id, is_active);

create table boosts (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  views_purchased int not null,
  amount numeric(12,2) not null,
  views_used int default 0,
  starts_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create type payment_status as enum ('en_attente', 'reussi', 'echoue', 'rembourse');

create table payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  reference text unique not null,
  purpose text not null,
  related_id uuid,
  amount numeric(12,2) not null,
  currency text default 'XAF',
  method text,
  status payment_status not null default 'en_attente',
  webhook_payload jsonb,
  created_at timestamptz default now()
);
create index idx_payments_user on payments (user_id);
create index idx_payments_status on payments (status);

-- ============================================================================
-- 9. RÉSEAU SOCIAL
-- ============================================================================

create table posts (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references pros(id) on delete cascade,
  type text default 'publication',
  caption text,
  media_url text not null,
  media_type text,
  likes_count int default 0,
  comments_count int default 0,
  shares_count int default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table post_likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

create table post_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table follows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  pro_id uuid not null references pros(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, pro_id)
);

-- ============================================================================
-- 10. NOTIFICATIONS / GPS / ACTIVITÉ
-- ============================================================================

create type notification_type as enum ('info', 'promo', 'urgence', 'rappel', 'message', 'paiement');

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null default 'info',
  title text not null,
  body text,
  data jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);
create index idx_notifications_user on notifications (user_id, is_read);

create table gps_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  location geography(Point, 4326) not null,
  recorded_at timestamptz default now()
);
create index idx_gps_history_user on gps_history (user_id, recorded_at desc);

create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

create table reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text default 'en_attente',
  created_at timestamptz default now()
);

-- ============================================================================
-- 11. FONCTIONS UTILES
-- ============================================================================

create or replace function pro_distance_meters(pro_location geography, client_location geography)
returns numeric language sql immutable as $$
  select ST_Distance(pro_location, client_location);
$$;

create or replace function compute_ranking_score(p_pro_id uuid, client_location geography default null)
returns numeric language plpgsql as $$
declare
  v_plan_weight numeric;
  v_boost_weight numeric := 0;
  v_rating numeric;
  v_distance numeric := 0;
  v_score numeric;
begin
  select
    case plan
      when 'pro_max' then 100
      when 'pro_6mois' then 70
      when 'pro_mensuel' then 50
      when 'essai' then 20
      else 5
    end,
    coalesce(rating_avg, 0)
  into v_plan_weight, v_rating
  from pros where id = p_pro_id;

  select coalesce(sum(views_purchased - views_used), 0) / 10000.0
  into v_boost_weight
  from boosts where pro_id = p_pro_id and is_active and (expires_at is null or expires_at > now());

  if client_location is not null then
    select ST_Distance(location, client_location) into v_distance from pros where id = p_pro_id;
  end if;

  v_score := v_plan_weight + v_boost_weight + (v_rating * 10) - (coalesce(v_distance, 0) / 1000.0);

  update pros set ranking_score = v_score where id = p_pro_id;
  return v_score;
end;
$$;

create or replace function refresh_pro_rating() returns trigger language plpgsql as $$
begin
  update pros set
    rating_avg = (select round(avg(rating)::numeric, 1) from reviews where pro_id = coalesce(new.pro_id, old.pro_id)),
    rating_count = (select count(*) from reviews where pro_id = coalesce(new.pro_id, old.pro_id))
  where id = coalesce(new.pro_id, old.pro_id);
  return new;
end;
$$;
create trigger trg_refresh_rating
after insert or update or delete on reviews
for each row execute function refresh_pro_rating();

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table users enable row level security;
alter table pros enable row level security;
alter table products enable row level security;
alter table services enable row level security;
alter table jobs enable row level security;
alter table restaurants enable row level security;
alter table health_centers enable row level security;
alter table appointments enable row level security;
alter table vaccination_records enable row level security;
alter table teleconsultations enable row level security;
alter table sos_alerts enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table subscriptions enable row level security;
alter table boosts enable row level security;
alter table payments enable row level security;
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table post_comments enable row level security;
alter table follows enable row level security;
alter table notifications enable row level security;
alter table gps_history enable row level security;
alter table activity_log enable row level security;
alter table reports enable row level security;

create policy "users_select_own_or_public" on users for select using (true);
create policy "users_update_own" on users for update using (auth.uid() = auth_id);
create policy "users_insert_own" on users for insert with check (auth.uid() = auth_id);

create policy "pros_select_all" on pros for select using (is_active = true);
create policy "pros_insert_own" on pros for insert with check (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "pros_update_own" on pros for update using (
  user_id in (select id from users where auth_id = auth.uid())
);

create policy "products_select_all" on products for select using (is_active = true);
create policy "products_write_own" on products for all using (
  pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);

create policy "services_select_all" on services for select using (true);
create policy "services_write_own" on services for all using (
  pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);

create policy "jobs_select_all" on jobs for select using (true);
create policy "jobs_write_own" on jobs for all using (
  pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);

create policy "restaurants_select_all" on restaurants for select using (true);
create policy "health_centers_select_all" on health_centers for select using (true);

create policy "appointments_own" on appointments for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "vaccination_own" on vaccination_records for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "teleconsult_own" on teleconsultations for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "sos_own" on sos_alerts for all using (
  user_id in (select id from users where auth_id = auth.uid())
);

create policy "chats_participants" on chats for all using (
  client_id in (select id from users where auth_id = auth.uid())
  or pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);
create policy "messages_participants" on messages for all using (
  chat_id in (
    select id from chats where
      client_id in (select id from users where auth_id = auth.uid())
      or pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
  )
);

create policy "reviews_select_all" on reviews for select using (true);
create policy "reviews_insert_own" on reviews for insert with check (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "reviews_update_own_or_pro_reply" on reviews for update using (
  user_id in (select id from users where auth_id = auth.uid())
  or pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);

create policy "subscriptions_own" on subscriptions for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "payments_own" on payments for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "boosts_own" on boosts for all using (
  pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);

create policy "posts_select_all" on posts for select using (true);
create policy "posts_write_own" on posts for all using (
  pro_id in (select id from pros where user_id in (select id from users where auth_id = auth.uid()))
);
create policy "post_likes_own" on post_likes for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "post_comments_select_all" on post_comments for select using (true);
create policy "post_comments_insert_own" on post_comments for insert with check (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "follows_own" on follows for all using (
  user_id in (select id from users where auth_id = auth.uid())
);

create policy "notifications_own" on notifications for all using (
  user_id in (select id from users where auth_id = auth.uid())
);
create policy "gps_history_own" on gps_history for all using (
  user_id in (select id from users where auth_id = auth.uid())
);

create policy "reports_own" on reports for select using (
  reporter_id in (select id from users where auth_id = auth.uid())
);
create policy "reports_insert_own" on reports for insert with check (
  reporter_id in (select id from users where auth_id = auth.uid())
);

-- Journal d'activité et modération : accès réservé à la clé service_role (dashboard admin),
-- volontairement aucune policy select/insert publique.

-- ============================================================================
-- FIN DU SCHEMA
-- ============================================================================
