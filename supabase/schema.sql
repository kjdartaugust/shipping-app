-- ============================================================================
-- SwiftShip — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL > New query).
-- It is idempotent-ish: safe to run on a fresh project.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer', 'agent', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shipment_status as enum (
    'pending','confirmed','picked_up','in_transit',
    'out_for_delivery','delivered','exception','cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum ('standard','express','overnight');
exception when duplicate_object then null; end $$;

do $$ begin
  create type package_type as enum ('document','parcel','box','pallet','fragile');
exception when duplicate_object then null; end $$;

-- Profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Shipments ------------------------------------------------------------------
create table if not exists public.shipments (
  id uuid primary key default uuid_generate_v4(),
  tracking_number text unique not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  agent_id uuid references public.profiles(id) on delete set null,
  recipient_name text not null,
  recipient_phone text,
  recipient_email text,
  origin_address text not null,
  origin_lat double precision,
  origin_lng double precision,
  dest_address text not null,
  dest_lat double precision,
  dest_lng double precision,
  package_type package_type not null default 'parcel',
  weight_kg numeric not null default 1,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  declared_value numeric,
  service_type service_type not null default 'standard',
  status shipment_status not null default 'pending',
  price numeric not null default 0,
  notes text,
  estimated_delivery timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_sender_idx on public.shipments(sender_id);
create index if not exists shipments_agent_idx on public.shipments(agent_id);
create index if not exists shipments_status_idx on public.shipments(status);
create index if not exists shipments_tracking_idx on public.shipments(tracking_number);

-- Tracking events ------------------------------------------------------------
create table if not exists public.tracking_events (
  id uuid primary key default uuid_generate_v4(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status shipment_status not null,
  location text,
  lat double precision,
  lng double precision,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists tracking_shipment_idx on public.tracking_events(shipment_id);

-- Notifications --------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id);

-- ============================================================================
-- Triggers & functions
-- ============================================================================

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep shipments.updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists shipments_touch on public.shipments;
create trigger shipments_touch
  before update on public.shipments
  for each row execute function public.touch_updated_at();

-- Log a tracking event automatically whenever a shipment status changes.
create or replace function public.log_status_change()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') or (new.status is distinct from old.status) then
    insert into public.tracking_events (shipment_id, status, location, lat, lng, note)
    values (
      new.id, new.status,
      coalesce(new.dest_address, ''), new.dest_lat, new.dest_lng,
      'Status updated to ' || new.status
    );
    insert into public.notifications (user_id, title, message, type, link)
    values (
      new.sender_id,
      'Shipment ' || new.tracking_number,
      'Your shipment is now: ' || replace(new.status::text, '_', ' '),
      case when new.status = 'delivered' then 'success'
           when new.status = 'exception' then 'error'
           else 'info' end,
      '/dashboard/shipments/' || new.id
    );
  end if;
  return new;
end; $$;

drop trigger if exists shipments_status_log on public.shipments;
create trigger shipments_status_log
  after insert or update of status on public.shipments
  for each row execute function public.log_status_change();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: is the current user an agent?
create or replace function public.is_agent()
returns boolean language sql security definer stable set search_path = public as $$
  select exists(
    select 1 from public.profiles where id = auth.uid() and role in ('agent','admin')
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.notifications enable row level security;

-- Profiles
drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin() or public.is_agent());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Shipments
drop policy if exists "shipments select" on public.shipments;
create policy "shipments select" on public.shipments
  for select using (
    sender_id = auth.uid() or agent_id = auth.uid() or public.is_admin()
  );

drop policy if exists "shipments insert own" on public.shipments;
create policy "shipments insert own" on public.shipments
  for insert with check (sender_id = auth.uid());

drop policy if exists "shipments update" on public.shipments;
create policy "shipments update" on public.shipments
  for update using (
    sender_id = auth.uid() or agent_id = auth.uid() or public.is_admin()
  );

drop policy if exists "shipments delete admin" on public.shipments;
create policy "shipments delete admin" on public.shipments
  for delete using (public.is_admin());

-- Tracking events
drop policy if exists "tracking select" on public.tracking_events;
create policy "tracking select" on public.tracking_events
  for select using (
    exists (
      select 1 from public.shipments s
      where s.id = shipment_id
        and (s.sender_id = auth.uid() or s.agent_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "tracking insert agent" on public.tracking_events;
create policy "tracking insert agent" on public.tracking_events
  for insert with check (public.is_agent());

-- Notifications
drop policy if exists "notifications own" on public.notifications;
create policy "notifications own" on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications
  for update using (user_id = auth.uid());

-- ============================================================================
-- Realtime
-- ============================================================================
alter publication supabase_realtime add table public.shipments;
alter publication supabase_realtime add table public.tracking_events;
alter publication supabase_realtime add table public.notifications;
