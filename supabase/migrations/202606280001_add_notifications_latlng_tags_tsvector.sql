begin;

-- Add notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null,
  payload jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Add lat/lng to items for proximity filtering
alter table public.items
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

-- Tags and many-to-many relation for items
create table if not exists public.tags (
  id serial primary key,
  name text not null unique
);

create table if not exists public.item_tags (
  item_id uuid not null references public.items(id) on delete cascade,
  tag_id integer not null references public.tags(id) on delete cascade,
  primary key (item_id, tag_id)
);

-- RLS: notifications readable by owner or admin
alter table public.notifications enable row level security;
create policy "notifications for user" on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy "users create notifications" on public.notifications for insert with check (user_id = auth.uid() or public.is_admin());

-- Full-text search vector on items
alter table public.items
  add column if not exists search_vector tsvector;

-- Function to update search_vector
create or replace function public.items_search_vector_trigger() returns trigger language plpgsql as $$
begin
  new.search_vector := to_tsvector('indonesian', coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' || coalesce(new.location, ''));
  return new;
end;
$$;

-- Trigger to keep search_vector up-to-date
drop trigger if exists items_search_vector_update on public.items;
create trigger items_search_vector_update
before insert or update on public.items
for each row execute procedure public.items_search_vector_trigger();

-- Index for fast full-text search
create index if not exists items_search_vector_idx on public.items using gin(search_vector);

commit;
