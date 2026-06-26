    # BaeBack

BaeBack adalah website charity marketplace untuk membagikan barang layak pakai secara gratis, mengajukan pengambilan barang, dan menemukan kebutuhan komunitas melalui Need Board.

## Stack

- React
- Vite
- JavaScript/JSX
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage

## Menjalankan Lokal

1. Install dependency:

```bash
npm install
```

2. Salin `.env.example` menjadi `.env` dan isi credential Supabase:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Jalankan dev server:

```bash
npm run dev
```

4. Build produksi:

```bash
npm run build
```

## Supabase

Migration MVP tersedia di:

```text
supabase/migrations/202606130001_baeback_mvp.sql
```

Migration tersebut membuat tabel utama, RLS policy, trigger profile otomatis, bucket Storage `item-images` dan `avatars`, serta seed awal Impact Counter.

Admin awal dapat dibuat dengan mengubah `profiles.role` menjadi `admin` lewat Supabase dashboard.

## Mode Demo

Jika `.env` belum diisi, aplikasi tetap bisa dibuka dengan data fallback untuk melihat UI dan flow utama. Penyimpanan sungguhan aktif setelah Supabase dikonfigurasi.
