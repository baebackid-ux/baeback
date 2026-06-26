create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  location text,
  avatar_url text,
  bio text,
  kindness_points integer not null default 0,
  badge text not null default 'new_donor',
  rating_average numeric(3, 2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  condition text not null,
  quantity integer not null default 1 check (quantity > 0),
  description text not null,
  location text not null,
  pickup_method text not null,
  status text not null default 'available' check (status in ('available', 'reviewing', 'reserved', 'received', 'cancelled', 'unavailable')),
  post_type text not null default 'community' check (post_type in ('official', 'community')),
  requirements text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  planned_pickup_at timestamptz,
  note text,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected', 'waiting_pickup', 'received', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, requester_id)
);

create table if not exists public.need_posts (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  location text not null,
  urgency text not null default 'Masih Dibutuhkan',
  description text not null,
  status text not null default 'open' check (status in ('open', 'offered', 'fulfilled', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.need_offers (
  id uuid primary key default gen_random_uuid(),
  need_post_id uuid not null references public.need_posts(id) on delete cascade,
  donor_id uuid references public.profiles(id) on delete set null,
  message text not null,
  status text not null default 'offered' check (status in ('offered', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  pickup_request_id uuid references public.pickup_requests(id) on delete cascade,
  item_id uuid references public.items(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  pickup_request_id uuid references public.pickup_requests(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  unique (pickup_request_id, reviewer_id, reviewed_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  reported_user_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  description text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.impact_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Pengguna BaeBack'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_images enable row level security;
alter table public.pickup_requests enable row level security;
alter table public.need_posts enable row level security;
alter table public.need_offers enable row level security;
alter table public.favorites enable row level security;
alter table public.messages enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.impact_stats enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles are readable" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "active items are readable" on public.items for select using (status in ('available', 'reviewing', 'reserved', 'received') or donor_id = auth.uid() or public.is_admin());
create policy "authenticated users create community items" on public.items for insert with check (auth.uid() = donor_id and post_type = 'community');
create policy "admins create official items" on public.items for insert with check (auth.uid() = donor_id and (post_type = 'community' or public.is_admin()));
create policy "donors update own items" on public.items for update using (donor_id = auth.uid() or public.is_admin()) with check (donor_id = auth.uid() or public.is_admin());
create policy "admins delete items" on public.items for delete using (public.is_admin());

create policy "item images readable" on public.item_images for select using (true);
create policy "donors manage item images" on public.item_images for all using (
  exists (select 1 from public.items where items.id = item_images.item_id and (items.donor_id = auth.uid() or public.is_admin()))
) with check (
  exists (select 1 from public.items where items.id = item_images.item_id and (items.donor_id = auth.uid() or public.is_admin()))
);

create policy "request participants read" on public.pickup_requests for select using (
  requester_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.items where items.id = pickup_requests.item_id and items.donor_id = auth.uid())
);
create policy "users create pickup requests" on public.pickup_requests for insert with check (requester_id = auth.uid());
create policy "request participants update" on public.pickup_requests for update using (
  requester_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.items where items.id = pickup_requests.item_id and items.donor_id = auth.uid())
) with check (
  requester_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.items where items.id = pickup_requests.item_id and items.donor_id = auth.uid())
);

create policy "need posts readable" on public.need_posts for select using (status in ('open', 'offered', 'fulfilled') or requester_id = auth.uid() or public.is_admin());
create policy "users create need posts" on public.need_posts for insert with check (requester_id = auth.uid());
create policy "owners update need posts" on public.need_posts for update using (requester_id = auth.uid() or public.is_admin()) with check (requester_id = auth.uid() or public.is_admin());

create policy "need offers participants read" on public.need_offers for select using (
  donor_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.need_posts where need_posts.id = need_offers.need_post_id and need_posts.requester_id = auth.uid())
);
create policy "users create need offers" on public.need_offers for insert with check (donor_id = auth.uid());
create policy "participants update need offers" on public.need_offers for update using (
  donor_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.need_posts where need_posts.id = need_offers.need_post_id and need_posts.requester_id = auth.uid())
) with check (
  donor_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.need_posts where need_posts.id = need_offers.need_post_id and need_posts.requester_id = auth.uid())
);

create policy "users manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "messages participants read" on public.messages for select using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin());
create policy "users create messages" on public.messages for insert with check (sender_id = auth.uid());

create policy "ratings readable" on public.ratings for select using (true);
create policy "users create ratings" on public.ratings for insert with check (reviewer_id = auth.uid());

create policy "users create reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "users read own reports" on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
create policy "admins update reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());

create policy "impact stats readable" on public.impact_stats for select using (true);
create policy "admins manage impact stats" on public.impact_stats for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "item images public read" on storage.objects for select using (bucket_id = 'item-images');
create policy "avatars public read" on storage.objects for select using (bucket_id = 'avatars');
create policy "authenticated users upload item images" on storage.objects for insert with check (bucket_id = 'item-images' and auth.role() = 'authenticated');
create policy "authenticated users upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "users update own storage objects" on storage.objects for update using (owner = auth.uid() or public.is_admin()) with check (owner = auth.uid() or public.is_admin());
create policy "users delete own storage objects" on storage.objects for delete using (owner = auth.uid() or public.is_admin());

insert into public.impact_stats (label, value, sort_order)
values
  ('Barang tersalurkan', '1.240', 1),
  ('Orang terbantu', '890', 2),
  ('Donatur aktif', '75', 3),
  ('Kota terjangkau', '42', 4)
on conflict do nothing;
