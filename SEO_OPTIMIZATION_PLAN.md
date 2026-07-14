# 🚀 Rencana Optimalisasi SEO Non-Koding — BaeBack

Dokumen ini berisi panduan dan rencana aksi untuk memaksimalkan performa SEO proyek BaeBack yang **tidak dapat diselesaikan langsung di dalam kode** (memerlukan konfigurasi pihak ketiga, platform hosting, DNS, atau strategi konten).

---

## 1. Integrasi Google Search Console & Bing Webmaster
Untuk memastikan mesin pencari mengetahui keberadaan website dan mengindeks seluruh halamannya secara cepat.
*   **Pendaftaran Domain**: Daftarkan domain utama (misal: `https://baeback.pages.dev`) di [Google Search Console](https://search.google.com/search-console) dan [Bing Webmaster Tools](https://www.bing.com/webmasters).
*   **Kirimkan Sitemap**: Masukkan URL sitemap dinamis proyek (`https://baeback.pages.dev/sitemap.xml`) di menu *Sitemaps*. Ini membantu crawler menemukan postingan barang dan campaign baru secara otomatis.
*   **Pemantauan *Index Coverage***: Cek secara berkala apakah ada halaman yang gagal diindeks karena kesalahan redirect, 404, atau masalah perayapan seluler (*mobile-friendliness*).

---

## 2. Setup Analytics & Pemantauan Core Web Vitals Nyata
Google memprioritaskan performa situs berdasarkan data dari pengguna asli (Chrome User Experience Report / CrUX).
*   **Vercel / Plausible Analytics**: Pasang alat analitik ringan di dashboard hosting (seperti Vercel Speed Insights atau Plausible Analytics) untuk memantau metrik **INP (Interaction to Next Paint)**, **CLS (Cumulative Layout Shift)**, dan **LCP** dari perangkat pengguna sesungguhnya.
*   **Hindari Tracker Berat**: Jangan pasang script pelacak pihak ketiga yang terlalu banyak (misalnya multiple marketing pixels) karena akan memperlambat waktu respons interaktif halaman (INP).

---

## 3. Konfigurasi DNS & SSL Tingkat Lanjut
*   **Redireksi Domain Tunggal**: Pastikan hanya ada satu alamat canonical yang dapat diakses (misal: redirect otomatis dari `www.baeback.pages.dev` ke `baeback.pages.dev`, atau sebaliknya). Hal ini mencegah penalti "konten duplikat" (*duplicate content*) dari Google.
*   **HTTP/2 atau HTTP/3**: Gunakan penyedia hosting (seperti Vercel atau Netlify) yang secara otomatis menyajikan aset menggunakan protokol HTTP/2 atau HTTP/3 untuk pemuatan file CSS/JS paralel yang lebih cepat.

---

## 4. Strategi Konten & Backlink (Off-Page SEO)
SEO tidak hanya tentang teknis web, tetapi juga tentang reputasi dan otoritas domain.
*   **Kampanye Media Sosial**: Bagikan campaign kebaikan dari BaeBack ke platform sosial. Tag Open Graph (OG) yang kita pasang di kode akan menampilkan kartu preview gambar dan deskripsi yang rapi untuk memikat klik.
*   **Kerja Sama Publikasi (Backlink)**: Jalin kerja sama dengan yayasan charity, media lokal, atau blog komunitas untuk menulis tentang BaeBack. Backlink dari situs otoritas tinggi ke `baeback.pages.dev` sangat memengaruhi posisi peringkat di Google.
*   **Riset Kata Kunci**: Selalu arahkan teks di halaman statis (seperti deskripsi di Tentang Kami atau Panduan) untuk menyasar kata kunci bervolume tinggi namun kompetisi rendah, seperti *"donasi barang layak pakai gratis"*, *"charity marketplace Indonesia"*, atau *"berbagi baju bekas layak pakai"*.
