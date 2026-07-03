-- Campaign donasi uang + riwayat donasi
-- Semua INSERT donasi hanya lewat backend (service role), bukan dari frontend langsung

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  target_amount bigint not null check (target_amount > 0),
  collected_amount bigint not null default 0 check (collected_amount >= 0),
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'closed')),
  image_url text,
  category text,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  donor_id uuid not null references public.profiles(id) on delete cascade,
  amount bigint not null check (amount >= 1000 and amount <= 100000000),
  message text check (char_length(message) <= 500),
  status text not null default 'recorded' check (status in ('recorded', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists donations_donor_id_idx on public.donations (donor_id, created_at desc);
create index if not exists donations_campaign_id_idx on public.donations (campaign_id, created_at desc);
create index if not exists campaigns_status_idx on public.campaigns (status, created_at desc);

-- Perbarui collected_amount secara atomik saat donasi dicatat
create or replace function public.sync_campaign_collected()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' and NEW.status = 'recorded' then
    update public.campaigns
    set collected_amount = collected_amount + NEW.amount,
        updated_at = now()
    where id = NEW.campaign_id
      and status = 'active';
    if not found then
      raise exception 'Campaign tidak aktif atau tidak ditemukan';
    end if;
  elsif TG_OP = 'UPDATE' and OLD.status = 'recorded' and NEW.status = 'cancelled' then
    update public.campaigns
    set collected_amount = greatest(0, collected_amount - OLD.amount),
        updated_at = now()
    where id = OLD.campaign_id;
  end if;
  return NEW;
end;
$$;

create trigger donations_sync_campaign_collected
  after insert or update on public.donations
  for each row execute function public.sync_campaign_collected();

alter table public.campaigns enable row level security;
alter table public.donations enable row level security;

-- Campaign aktif bisa dibaca publik (read-only dari frontend jika perlu fallback)
create policy "active campaigns readable"
  on public.campaigns for select
  using (status = 'active' or public.is_admin());

create policy "admins manage campaigns"
  on public.campaigns for all
  using (public.is_admin())
  with check (public.is_admin());

-- Donasi: TIDAK ada policy INSERT/UPDATE untuk user biasa
-- Backend memakai service role key yang bypass RLS
create policy "users read own donations"
  on public.donations for select
  using (donor_id = auth.uid() or public.is_admin());

-- Seed campaign contoh
insert into public.campaigns (title, slug, description, target_amount, collected_amount, status, category, image_url)
values
  (
    'Bantuan Pendidikan Anak Yatim',
    'bantuan-pendidikan-anak-yatim',
    'Mengumpulkan dana untuk biaya sekolah, buku, dan seragam 50 anak yatim di Bandung.',
    50000000,
    12500000,
    'active',
    'Pendidikan',
    null
  ),
  (
    'Bantuan Korban Bencana',
    'bantuan-korban-bencana',
    'Donasi untuk kebutuhan dasar: makanan, pakaian, dan perlengkapan darurat bagi korban bencana alam.',
    100000000,
    43200000,
    'active',
    'Kemanusiaan',
    null
  ),
  (
    'Operasi Jantung Anak',
    'operasi-jantung-anak',
    'Membantu biaya operasi jantung untuk 3 anak dari keluarga tidak mampu.',
    75000000,
    75000000,
    'completed',
    'Kesehatan',
    null
  )
on conflict (slug) do nothing;
