# 📚 BaeBack - Knowledge Base

## 1. Ringkasan Saat Ini
BaeBack adalah platform charity marketplace berbasis React + Vite + Supabase untuk berbagi barang layak pakai secara gratis, mengajukan pengambilan barang, dan memposting kebutuhan komunitas melalui Need Board.

Repo ini sudah berbentuk aplikasi web yang bisa dijalankan lokal atau dihosting sebagai SPA. Akses data utama bergantung pada env Supabase; jika env belum diisi, aplikasi tetap berjalan dalam mode demo dengan data fallback.

## 2. Stack Aktif
- Frontend: React 18.3.1, Vite 5.4.11, React Router DOM 6.28.0, Lenis, Lucide React
- Backend: Supabase Auth, PostgreSQL, Supabase Storage
- Tooling: ESLint 9, React Hooks lint, React Refresh lint

## 3. Routing Aktif
### Public routes
- `/` → HomePage
- `/barang` → ItemsPage
- `/barang/:id` → ItemDetailPage
- `/need-board` → NeedBoardPage
- `/need-board/:id` → NeedDetailPage
- `/login` → AuthPage login
- `/register` → AuthPage register

### Protected routes
- `/donasikan` → DonateItemPage
- `/dashboard` → DashboardPage
- `/daftar-minat` → FavoritesPage
- `/pengajuan` → RequestsPage
- `/profil` → ProfilePage

### Admin route
- `/admin` → AdminPage

### Fallback
- `*` → NotFoundPage

Catatan: routing memakai BrowserRouter, jadi hosting production harus punya rewrite ke index.html untuk semua route SPA.

## 4. Context & Auth
### AuthContext
State yang tersedia dari `useAuth()`:
- `session`
- `user`
- `profile`
- `loading`
- `isAuthenticated`
- `isAdmin`
- `signIn()`
- `signUp()`
- `signOut()`
- `incrementKindnessPointsLocal()` untuk demo mode

Perilaku saat ini:
- Jika Supabase terkonfigurasi, auth memakai session nyata dari Supabase.
- Jika Supabase belum terkonfigurasi, aplikasi memakai demo profile dan menganggap user authenticated agar UI tetap bisa dieksplorasi.
- `ensureProfile()` membuat record `profiles` bila user belum punya profil.

### LenisContext
- Dipakai untuk smooth scrolling pada layout utama.

## 5. Data Model Aktif
### Dari migration utama
File utama: `supabase/migrations/202606130001_baeback_mvp.sql`

Tabel yang sudah didefinisikan:
- `profiles`
- `items`
- `item_images`
- `pickup_requests`
- `need_posts`
- `need_offers`
- `favorites`
- `messages`
- `ratings`
- `reports`
- `impact_stats`

Storage buckets:
- `item-images`
- `avatars`

### Migration tambahan
File: `supabase/migrations/202606280001_add_notifications_latlng_tags_tsvector.sql`

Tambahan skema saat ini:
- `notifications`
- `tags`
- `item_tags`
- `latitude` dan `longitude` di `items`
- `search_vector` di `items`
- trigger untuk update search vector
- index GIN untuk pencarian teks penuh

## 6. Fitur Yang Sudah Ada Di UI
### Home
- Hero section, featured items, kategori, impact counter, dan timeline alur kerja
- Data bisa berasal dari Supabase atau fallback demo data

### Items
- Daftar barang dengan filter kategori, kondisi, pickup method, dan search query
- Mode Supabase memakai pagination server-side + infinite scroll
- Mode demo memakai slice data fallback

### Item detail
- Detail barang, status pill, badge, donor card, related items
- Aksi yang tersedia: ajukan ambil, simpan favorit, lapor barang

### Donate item
- Form donasi barang
- Kompresi gambar di sisi client sebelum upload
- Upload ke Supabase Storage jika Supabase aktif
- Insert ke `items`, lalu insert ke `item_images` jika ada file upload

### Requests
- Daftar pengajuan user
- Aksi status: approved, rejected, waiting_pickup, received
- Rating donor
- Ada jalur demo untuk update kindness points lokal

### Need Board
- List dan detail kebutuhan komunitas
- Create need post
- Create need offer

### Auth
- Login dan register berbasis Supabase Auth
- Mode demo langsung mengarah ke dashboard contoh

## 7. Status Data & Flow Aktual
### Items
- UI dan migration mendukung status: `available`, `reviewing`, `reserved`, `received`, `cancelled`, `unavailable`
- Di beberapa halaman, status yang paling sering dipakai saat ini adalah `available`, `reserved`, dan `received`

### Pickup requests
- Flow yang dipakai UI: `submitted` → `approved` / `rejected` → `waiting_pickup` → `received`
- Database juga mendukung `cancelled`

### Need posts
- Flow yang dipakai: `open` → `offered` → `fulfilled` / `closed`
- UI saat ini masih menggunakan data dan interaksi dasar, belum ada orkestrasi notifikasi penuh

## 8. Kebiasaan Implementasi Saat Ini
- Banyak halaman memakai fallback data agar UI tetap hidup saat Supabase belum dikonfigurasi.
- Beberapa aksi tulis masih menganggap operasi berhasil jika env Supabase aktif, jadi error handling produksi masih perlu diperketat.
- Data baru dari migration tambahan belum semuanya dipakai di UI, terutama notifications, tags, dan geolocation.

## 9. Keamanan & Akses
### Yang sudah ada di database
- RLS aktif untuk tabel utama
- Admin ditentukan lewat `profiles.role = 'admin'`
- Trigger `handle_new_user()` membuat profil baru saat auth signup
- Storage policy sudah dibuat untuk read/write bucket utama

### Catatan penting
- Public read pada beberapa tabel seperti `profiles`, `ratings`, dan bucket `item-images` masih sesuai untuk produk publik, tetapi tetap perlu ditinjau ulang sebelum launch serius.
- Hosting production harus menyuplai env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.

## 10. File Kunci
- [src/main.jsx](src/main.jsx)
- [src/App.jsx](src/App.jsx)
- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx)
- [src/lib/supabase.js](src/lib/supabase.js)
- [src/pages/HomePage.jsx](src/pages/HomePage.jsx)
- [src/pages/ItemsPage.jsx](src/pages/ItemsPage.jsx)
- [src/pages/ItemDetailPage.jsx](src/pages/ItemDetailPage.jsx)
- [src/pages/DonateItemPage.jsx](src/pages/DonateItemPage.jsx)
- [src/pages/RequestsPage.jsx](src/pages/RequestsPage.jsx)
- [supabase/migrations/202606130001_baeback_mvp.sql](supabase/migrations/202606130001_baeback_mvp.sql)
- [supabase/migrations/202606280001_add_notifications_latlng_tags_tsvector.sql](supabase/migrations/202606280001_add_notifications_latlng_tags_tsvector.sql)

## 11. Catatan Production
- Perlu rewrite SPA di hosting.
- Perlu mematikan atau memisahkan mode demo untuk environment production.
- Perlu error handling yang lebih tegas pada semua aksi write ke Supabase.
- Fitur notifications, tags, search vector, dan geolocation masih berupa fondasi schema, belum penuh di UI.
# 📚 BaeBack - Knowledge Base untuk Diskusi

## 1. Deskripsi Project
**BaeBack** adalah platform charity marketplace yang memungkinkan masyarakat untuk berbagi barang layak pakai secara gratis. Platform ini menerapkan konsep "Ambil yang kamu butuhkan, berikan yang sudah tidak kamu gunakan" dengan mengintegrasikan sistem marketplace modern namun dengan fokus pada keadilan dan transparansi dalam distribusi barang.

### 1.1 Visi
Memfasilitasi ekonomi sirkular dan community sharing dengan mengutamakan:
- Transparansi (siapa dapat apa)
- Keadilan (prioritas untuk yang lebih butuh)
- Kepercayaan (rating & verification)
- Dampak sosial (track kindness points)

---

## 2. Peran Pengguna

### 2.1 User (Penerima & Pemberi)
- **Pemberi Barang**: Upload barang, terima requests, approve/reject penerima, rate penerima
- **Penerima Barang**: Browse barang, ajukan permintaan dengan alasan, terima approval, rate pemberi
- **Features**: Upload foto, edit profil, lihat rating, kumpulkan kindness points, dapatkan badges

### 2.2 Admin
- Kelola posting official dari charity/sponsor
- Moderate konten (block/remove inappropriate posts)
- Monitor platform activity
- Manage impact counter

### 2.3 Guest
- Browse barang & need board (read-only)
- Tidak bisa membuat request atau upload
- Bisa login/register dari halaman

---

## 3. Struktur Data Utama

### 3.1 Tabel Profiles
```sql
profiles {
  id: UUID (PK, FK auth.users),
  full_name: TEXT,
  role: ENUM['user', 'admin'],
  location: TEXT,
  avatar_url: TEXT,
  bio: TEXT,
  kindness_points: INTEGER (default 0),
  badge: TEXT (e.g., 'new_donor', 'trusted', 'verified'),
  rating_average: NUMERIC(3,2),
  rating_count: INTEGER,
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```
- Dibuat otomatis ketika user daftar via trigger
- Role bisa diubah dari Supabase dashboard ke 'admin'

### 3.2 Tabel Items
```sql
items {
  id: UUID (PK),
  donor_id: UUID (FK profiles),
  title: TEXT,
  category: TEXT (e.g., 'Pakaian', 'Elektronik'),
  condition: TEXT (e.g., 'Baru', 'Sangat Layak'),
  quantity: INTEGER (default 1),
  description: TEXT,
  location: TEXT,
  pickup_method: TEXT (e.g., 'Pickup Only', 'Delivery Available'),
  status: ENUM['available', 'reviewing', 'reserved', 'received', 'cancelled', 'unavailable'],
  post_type: ENUM['official', 'community'],
  requirements: TEXT (kondisi khusus untuk penerima),
  image_url: TEXT (primary image),
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```
- Status flow: available → reviewing (ada requests) → reserved (penerima dipilih) → received (selesai)

### 3.3 Tabel Pickup_Requests
```sql
pickup_requests {
  id: UUID (PK),
  item_id: UUID (FK items),
  requester_id: UUID (FK profiles),
  reason: TEXT (alasan penerima membutuhkan),
  planned_pickup_at: TIMESTAMPTZ,
  note: TEXT,
  status: ENUM['submitted', 'approved', 'rejected', 'waiting_pickup', 'received', 'cancelled'],
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
  
  CONSTRAINT: UNIQUE(item_id, requester_id) - satu user hanya bisa request satu item sekali
}
```
- Core dari sistem fairness: pemberi bisa compare multiple requests sebelum memilih

### 3.4 Tabel Need_Posts
```sql
need_posts {
  id: UUID (PK),
  requester_id: UUID (FK profiles),
  title: TEXT,
  category: TEXT,
  location: TEXT,
  urgency: TEXT (e.g., 'Sangat Mendesak', 'Masih Dibutuhkan'),
  description: TEXT,
  status: ENUM['open', 'offered', 'fulfilled', 'closed'],
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```
- Untuk kebutuhan komunitas: user post apa yang dicari, donor offer bantuan

### 3.5 Tabel Need_Offers
```sql
need_offers {
  id: UUID (PK),
  need_post_id: UUID (FK need_posts),
  donor_id: UUID (FK profiles),
  message: TEXT,
  status: ENUM['offered', 'accepted', 'declined', 'cancelled'],
  created_at: TIMESTAMPTZ
}
```
- Donor bisa menawarkan barang untuk kebutuhan tertentu

### 3.6 Tabel Item_Images
```sql
item_images {
  id: UUID (PK),
  item_id: UUID (FK items),
  storage_path: TEXT (path di Supabase Storage),
  alt_text: TEXT,
  sort_order: INTEGER,
  created_at: TIMESTAMPTZ
}
```
- Support multiple images per item

### 3.7 Tabel Favorites
```sql
favorites {
  user_id: UUID (FK profiles),
  item_id: UUID (FK items),
  created_at: TIMESTAMPTZ
  
  PRIMARY KEY (user_id, item_id)
}
```
- Wishlist: user bisa simpan barang untuk diingat nanti

### 3.8 Tabel Messages
```sql
messages {
  id: UUID (PK),
  pickup_request_id: UUID (FK pickup_requests),
  item_id: UUID (FK items),
  sender_id: UUID (FK profiles),
  receiver_id: UUID (FK profiles),
  body: TEXT,
  created_at: TIMESTAMPTZ
}
```
- Direct chat antara pemberi & penerima

### 3.9 Tabel Ratings
```sql
ratings {
  id: UUID (PK),
  pickup_request_id: UUID (FK pickup_requests),
  reviewer_id: UUID (FK profiles),
  recipient_id: UUID (FK profiles),
  rating: INTEGER (1-5),
  review_text: TEXT,
  created_at: TIMESTAMPTZ
}
```
- Build trust: pemberi & penerima saling rate

---

## 4. Alur Fungsional Utama

### 4.1 Alur Donasi Barang (Pemberi)
```
STEP 1: Login/Register
├─ User register dengan email
├─ Supabase Auth create session
└─ Trigger auto-create profile dengan role='user'

STEP 2: Dashboard → Donasikan
├─ Klik tombol "Donasikan Barang"
├─ Form: Judul, Kategori, Kondisi, Deskripsi
├─ Upload foto (bisa multiple)
├─ Pilih lokasi, metode pickup
└─ Submit ke tabel items dengan status='available'

STEP 3: Kelola Requests
├─ Dashboard tampilkan barang user
├─ Setiap barang tampilkan daftar pickup_requests
├─ User review: reason, profile penerima, rating penerima
└─ User pilih: approve/reject

STEP 4: Koordinasi & Pengambilan
├─ Approved request → status='waiting_pickup'
├─ Bisa chat dengan penerima di messages
├─ Koordinasi waktu & tempat pickup
└─ Setelah barang diambil: status='received'

STEP 5: Rating & Selesai
├─ User bisa rate penerima (1-5 bintang)
├─ Kindness points bertambah
├─ Badge mungkin unlock (e.g., 'trusted_donor')
└─ Impact counter terupdate

STATUS FLOW ITEM:
available → reviewing (ada requests) → reserved (ada approved request) → received (selesai)
                                    └─ cancelled (dibatalkan)
```

### 4.2 Alur Request Barang (Penerima)
```
STEP 1: Browse & Cari
├─ Homepage: lihat featured items
├─ /barang: search, filter kategori, lokasi, kondisi
├─ Item cards tampilkan: foto, title, location, pickup method
└─ Klik → Detail page

STEP 2: Lihat Detail Barang
├─ Foto carousel, deskripsi lengkap
├─ Profil pemberi: name, rating, kindness points
├─ Status barang, pickup method
├─ Button: "Tambah Favorit" / "Ajukan Ambil"
└─ Comments/messages section (jika ada)

STEP 3: Ajukan Permintaan
├─ Klik "Ajukan Ambil"
├─ Modal form: "Alasan kamu butuh barang ini?"
├─ Text area: "Saya butuh ini karena... saya sedang..."
├─ Submit → create pickup_request dengan status='submitted'
└─ Message: "Request sudah dikirim, tunggu approval pemberi"

STEP 4: Tunggu Approval
├─ /pengajuan page: lihat semua requests user
├─ Setiap request tampilkan: item, pemberi, status, tgl request
├─ Status options: Diajukan, Disetujui, Ditolak, Menunggu Pengambilan, Sudah Diterima
└─ Jika ditolak: user bisa request barang lain

STEP 5: Pickup Coordination
├─ Request approved → status='approved'
├─ Bisa chat dengan pemberi di item detail page
├─ Koordinasi: kapan pickup, tempat mana
├─ Pemberi bisa tentukan planned_pickup_at
└─ Both sides confirm kesiapan

STEP 6: Konfirmasi Penerimaan
├─ Setelah ambil barang → klik "Barang Sudah Diterima"
├─ Status → 'received'
├─ Item status juga → 'received'
├─ Modal: Rate pemberi (1-5 bintang, optional review)
└─ Kindness points user bertambah

STEP 7: Rating Pemberi
├─ User kasih rating & review
├─ Rating tersimpan di tabel ratings
├─ Pemberi's rating_average terupdate
└─ Selesai!

REQUEST STATUS FLOW:
submitted → approved/rejected
           ↓
      waiting_pickup (user sudah pickup atau koordinasi final)
           ↓
         received (confirmed penerima terima)
         
```

### 4.3 Alur Need Board (Dual Flow)
```
REQUESTER SIDE (User butuh sesuatu):
├─ Buka /need-board
├─ Lihat existing needs (filter: kategori, location, urgency)
├─ Klik "Post Kebutuhan"
├─ Form: Title, Category, Location, Urgency, Description
├─ Create need_post dengan status='open'
└─ Tunggu donor offer

DONOR SIDE (Pemberi lihat kebutuhan):
├─ Buka /need-board
├─ Browse needs dari komunitas
├─ Lihat detail kebutuhan & profil requester
├─ Klik "Tawarkan Bantuan"
├─ Form: pesan/deskripsi apa yang ditawarkan
├─ Create need_offer dengan status='offered'
└─ Requester terima notifikasi

NEGOTIATION:
├─ Messages antara requester & donor
├─ Discuss kondisi barang, pickup, dll
├─ Donor approve/decline offer
├─ Jika accepted → status='accepted', koordinasi pickup
└─ After pickup → both rate each other

NEED STATUS FLOW:
open (siap terima offers) → offered (ada yang offer) → accepted (deal) → fulfilled (pickup selesai)
                                                    └─ declined
```

### 4.4 Alur Authentication
```
REGISTER:
└─ Form: email, password, full name
   └─ Supabase.auth.signUp()
      └─ Email verification (jika required)
         └─ Trigger: auto-create profile di tabel profiles
            └─ Set role='user', kindness_points=0, badge='new_donor'

LOGIN:
└─ Form: email, password
   └─ Supabase.auth.signInWithPassword()
      └─ Get session & user data
         └─ Load profile dari tabel profiles via AuthContext

LOGOUT:
└─ Supabase.auth.signOut()
   └─ Clear session & profile state

PROTECTED ROUTES:
├─ /donasikan, /dashboard, /daftar-minat, /pengajuan, /profil
├─ Gunakan ProtectedRoute component
└─ Redirect ke /login jika belum auth

ADMIN ROUTES:
├─ /admin
├─ Gunakan AdminRoute component
└─ Check profile.role === 'admin', else redirect
```

---

## 5. Komponen Utama

### 5.1 Navigation & Layout
- **Navbar**: Logo, search, user menu, auth buttons
- **Footer**: Links, social, copyright
- **Skip Link**: Accessibility (lewati ke main content)

### 5.2 Auth Components
- **ProtectedRoute**: Guard untuk authenticated routes
- **AdminRoute**: Guard untuk admin-only routes
- **AuthPage**: Login & Register form (mode-based)

### 5.3 Item Components
- **ItemCard**: Mini item preview (image, title, location, status badge)
- **ItemDetailPage**: Full detail dengan photos, description, profile pemberi, ratings
- **SearchFilters**: Filter kategori, kondisi, lokasi, pickup method
- **StatusPill**: Visual status badge (Tersedia, Menunggu, dll)

### 5.4 Request Management
- **RequestModal**: Form untuk ajukan barang
- **RequestsPage**: Track semua requests user (submitted, approved, etc)
- **DashboardPage**: Untuk pemberi: lihat postingan & incoming requests

### 5.5 Community Features
- **NeedBoardPage**: Browse & create needs
- **NeedDetailPage**: Detail need & offers
- **NeedCard**: Mini need preview

### 5.6 User Profile
- **ProfilePage**: Edit profile, avatar, bio, lihat badges & ratings
- **AccountNav**: Profile menu di navbar

### 5.7 Favorites & Impact
- **FavoritesPage**: Saved items
- **ImpactCounter**: Display global stats (items donated, lives helped)
- **Badge**: Visual badge component

---

## 6. Context & State Management

### 6.1 AuthContext
```javascript
useAuth() {
  ├─ session: Supabase session object
  ├─ profile: User profile dari database
  ├─ loading: Loading state saat fetch profile
  ├─ signOut(): Logout
  └─ ensureProfile(): Auto-create profile jika missing
}
```
- Global state untuk user authentication
- Fallback demo profile jika Supabase belum configured

### 6.2 LenisContext
```javascript
useLenis() {
  └─ Smooth scrolling effect (Lenis library)
```

---

## 7. Data Constants

### 7.1 Categories
```
Pakaian, Buku & Alat Tulis, Elektronik, Perlengkapan Bayi,
Perabot Rumah, Mainan Anak, Alat Dapur, Perlengkapan Sekolah,
Kesehatan & Kebersihan, Lainnya
```

### 7.2 Social Categories (untuk targeting)
```
Untuk Pelajar, Untuk Mahasiswa, Untuk Keluarga, Untuk Bayi & Anak,
Untuk UMKM, Untuk Korban Bencana, Untuk Komunitas Sosial
```

### 7.3 Conditions
```
Baru, Sangat Layak, Layak Pakai, Perlu Perbaikan Ringan, Hanya untuk Sparepart
```

### 7.4 Pickup Methods
```
Pickup Only, Delivery Available, Butuh Dijemput
```

### 7.5 Item Status Flow
```
available → reviewing → reserved → received
         ↓
      cancelled/unavailable
```

### 7.6 Request Status Flow
```
submitted → approved/rejected → waiting_pickup → received
                             ↓
                        cancelled
```

---

## 8. Security & Permissions

### 8.1 Row-Level Security (RLS)
- Supabase policies enforce:
  - Users hanya bisa edit profil mereka sendiri
  - Users hanya bisa create requests untuk items dari user lain
  - Users hanya bisa lihat own messages
  - Admins bisa edit/delete any official posts

### 8.2 Authentication Checks
```javascript
✅ ProtectedRoute: Redirect ke login jika belum auth
✅ AdminRoute: Check profile.role === 'admin'
✅ Supabase Auth: Email/password validation
✅ Session persistence: via supabase.auth.getSession()
```

### 8.3 Data Validation
- Unique constraint: item + requester hanya bisa ada 1 request
- Check constraints: status, role, pickup_method dari enum
- NOT NULL: title, category, description, location

---

## 9. Tech Stack Details

### 9.1 Frontend
```
React 18.3.1 - UI framework
Vite 5.4.11 - Build tool (fast HMR)
React Router DOM 6.28.0 - Routing
Lenis 1.3.23 - Smooth scroll
Lucide React 0.468.0 - Icons
```

### 9.2 Backend
```
Supabase - Backend as a service
├─ Auth: Email/password authentication
├─ PostgreSQL: Database
└─ Storage: File storage (images)
```

### 9.3 Database
```
PostgreSQL (via Supabase)
├─ Tables: profiles, items, pickup_requests, need_posts, etc
├─ Row Level Security (RLS): Fine-grained access control
├─ Triggers: Auto-create profile on auth signup
├─ Storage buckets: item-images, avatars
└─ Migration: SQL versioning (202606130001_baeback_mvp.sql)
```

---

## 10. Key Features

### 10.1 Marketplace Features
- ✅ Browse items dengan filter & search
- ✅ Multiple images per item
- ✅ Item status tracking
- ✅ Pickup method options
- ✅ Request-based system (tidak instant checkout)

### 10.2 Community Features
- ✅ Need Board: post kebutuhan & offer
- ✅ Direct messaging
- ✅ Ratings & reviews
- ✅ User profiles dengan badges

### 10.3 User Engagement
- ✅ Kindness Points: reward untuk donasi/terima
- ✅ Badges: achievement system
- ✅ Favorites/Wishlist
- ✅ Rating system (trust building)

### 10.4 Admin Features
- ✅ Official posts (charity/sponsor)
- ✅ Content moderation
- ✅ Impact counter management

### 10.5 Accessibility
- ✅ Skip links
- ✅ Semantic HTML
- ✅ ESLint for code quality

---

## 11. API Integration Points

### 11.1 Supabase Auth
```javascript
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.getSession()
supabase.auth.onAuthStateChange(callback)
```

### 11.2 Supabase Database (CRUD)
```javascript
supabase
  .from('items')
  .select('*')
  .eq('status', 'available')

supabase
  .from('pickup_requests')
  .insert({ item_id, requester_id, reason, status: 'submitted' })

supabase
  .from('profiles')
  .update({ kindness_points: points + 5 })
```

### 11.3 Supabase Storage
```javascript
supabase.storage
  .from('item-images')
  .upload(`${itemId}/${filename}`, file)
```

---

## 12. Environment Configuration

### 12.1 Required .env Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 12.2 Demo Mode
- Jika .env kosong: gunakan fallback demoProfile
- UI tetap render dengan mock data
- Ideal untuk showcase tanpa Supabase setup

---

## 13. Routing Map

```
PUBLIC ROUTES:
  /                  → HomePage (featured items)
  /barang            → ItemsPage (marketplace)
  /barang/:id        → ItemDetailPage
  /need-board        → NeedBoardPage
  /need-board/:id    → NeedDetailPage
  /login             → AuthPage (mode: login)
  /register          → AuthPage (mode: register)

PROTECTED ROUTES (memerlukan login):
  /donasikan         → DonateItemPage (form upload)
  /dashboard         → DashboardPage (manage posts & requests)
  /daftar-minat      → FavoritesPage (wishlist)
  /pengajuan         → RequestsPage (track requests)
  /profil            → ProfilePage (edit profile)

ADMIN ROUTES (memerlukan role: admin):
  /admin             → AdminPage (moderate content)

FALLBACK:
  *                  → NotFoundPage
```

---

## 14. State Flow Diagram

```
App (LenisProvider)
 ├─ AuthProvider
 │   ├─ session (Supabase session)
 │   ├─ profile (User profile object)
 │   └─ loading (Auth loading state)
 │
 └─ Routes
     ├─ Public: HomePage, ItemsPage, NeedBoardPage, AuthPage
     ├─ Protected: DonateItemPage, DashboardPage, RequestsPage, ProfilePage
     └─ Admin: AdminPage
```

---

## 15. Key Interactions

### 15.1 Item Creation Flow
```
User → DonateItemPage → Form submit → Supabase insert items + item_images
                                    → Supabase Storage upload file
                                    → Redirect to dashboard
```

### 15.2 Request Approval Flow
```
Requester → ItemDetailPage → RequestModal submit
                          → Supabase insert pickup_requests (status: submitted)
                          
Donor → DashboardPage → View incoming requests for item
                     → Click approve → Supabase update status (approved)
                     → Notif sent to requester (future: email/push)
```

### 15.3 Completion Flow
```
Requester → Messages/coordinate
         → After pickup: klik "Barang Sudah Diterima"
         → Supabase update pickup_requests status (received)
         → Rating modal shown
         → Submit rating → Supabase insert ratings
         → Update profiles.rating_average via trigger
         → Kindness points++
```

---

## 16. Future Enhancements

**Potential improvements yang bisa didiskusikan:**

1. **Notifications**
   - Email/push when request received, approved, rejected
   - Real-time notifications via Supabase Realtime

2. **Messaging**
   - Real-time chat (Supabase Realtime)
   - Message read receipts

3. **Advanced Filtering**
   - Location radius search (geolocation)
   - Date filters (posted within X days)
   - Rating filters (min rating)

4. **Analytics**
   - Admin dashboard dengan stats
   - Item donation trends
   - User engagement metrics

5. **Gamification**
   - More badges (Trusted, Helpful, etc)
   - Leaderboard (top donors/helpers)
   - Streaks (consecutive donations)

6. **Categories**
   - Sub-categories untuk lebih spesifik
   - Custom tags

7. **Image Optimization**
   - Image compression
   - CDN for faster delivery

8. **Payment**
   - Optional donation feature (for ops)
   - Shipping label integration

9. **Verification**
   - ID verification for admins
   - Email verification require
   - Phone verification option

10. **Moderation Tools**
    - Report content
    - Block user
    - Auto-flag suspicious activity

---

## 17. Common Questions & Answers

**Q: Bagaimana pemberi tahu barang sudah diambil?**
A: Penerima klik "Barang Sudah Diterima" setelah pickup. Ini trigger update status & rating modal.

**Q: Bisa request multiple items sekaligus?**
A: Ya, setiap item punya request terpisah. User bisa request berbagai item dari berbagai pemberi.

**Q: Apa bedanya Items vs Need Posts?**
A: Items = barang yang siap diberi; Need Posts = kebutuhan komunitas yang mencari donor.

**Q: Siapa yang bisa post official items?**
A: Hanya admin (role: admin). Set via Supabase dashboard.

**Q: Bagaimana jika pemberi tidak approve?**
A: Request status tetap 'submitted'. Penerima bisa cancel atau tunggu, atau ajukan ke barang lain.

**Q: Kindness points buat apa?**
A: Gamification & social proof. Bisa unlock badges, ranking komunitas (future).

---

## 18. File Structure Reference

```
src/
├── App.jsx                    # Main routing
├── main.jsx                   # Entry point
├── styles.css                 # Global styles
│
├── components/                # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   ├── AdminRoute.jsx
│   ├── ItemCard.jsx
│   ├── RequestModal.jsx
│   ├── SearchFilters.jsx
│   ├── StatusPill.jsx
│   ├── Badge.jsx
│   ├── NeedCard.jsx
│   ├── ImpactCounter.jsx
│   ├── StepTimeline.jsx
│   ├── EmptyState.jsx
│   ├── AccountNav.jsx
│   └── ...more
│
├── contexts/                  # State management
│   ├── AuthContext.jsx        # Auth & profile
│   └── LenisContext.jsx        # Smooth scroll
│
├── pages/                     # Page components
│   ├── HomePage.jsx
│   ├── ItemsPage.jsx
│   ├── ItemDetailPage.jsx
│   ├── DonateItemPage.jsx
│   ├── DashboardPage.jsx
│   ├── RequestsPage.jsx
│   ├── FavoritesPage.jsx
│   ├── ProfilePage.jsx
│   ├── NeedBoardPage.jsx
│   ├── NeedDetailPage.jsx
│   ├── AdminPage.jsx
│   ├── AuthPage.jsx
│   └── NotFoundPage.jsx
│
├── lib/                       # Utilities & configs
│   ├── supabase.js            # Supabase client setup
│   ├── constants.js           # Constants (categories, statuses)
│   └── formatters.js          # Formatting helpers
│
└── data/
    └── mockData.js            # Demo data
```

---

Dokumentasi ini siap untuk dishare ke AI chat lain untuk diskusi lebih detail tentang implementasi, improvement, atau debugging! 🚀
