-- Idempotency untuk anti double donation
alter table public.donations
  add column if not exists idempotency_key text;

create unique index if not exists donations_idempotency_key_unique
  on public.donations (idempotency_key)
  where idempotency_key is not null;

-- Audit trail donasi
create table if not exists public.donation_events (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations(id) on delete set null,
  event_type text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  request_id text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists donation_events_donation_id_idx on public.donation_events (donation_id);
create index if not exists donation_events_request_id_idx on public.donation_events (request_id);

alter table public.donation_events enable row level security;

create policy "admins read donation events"
  on public.donation_events for select
  using (public.is_admin());
