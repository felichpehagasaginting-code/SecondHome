# Second Home Coffee — Web & Ordering Portal

Landing page modern dan portal pemesanan WhatsApp interaktif untuk **Second Home Coffee**, kedai kopi berbasis di Cibitung, Kabupaten Bekasi. Dibangun menggunakan Next.js 16, Tailwind CSS v4, GSAP 3, Lenis Scroll, dan Zustand.

---

## ☕ Profil Usaha

- **Nama Usaha**: Second Home Coffee
- **Tagline**: *"Premium taste, pocket friendly price"*
- **Lokasi**: Jl. Raya Setu, Cibuntu, Cibitung, Kabupaten Bekasi, Jawa Barat 17520
- **Layanan**: Dine-in & Take Away
- **Jam Operasional**:
  - Senin – Jumat: 09.00 – 23.00 WIB
  - Sabtu – Minggu: 14.00 – 23.00 WIB
- **Kontak WhatsApp**: [0813-6020-2396](https://wa.me/6281360202396)
- **Instagram**: [@scndhomecoffee](https://instagram.com/scndhomecoffee)
- **Google Maps**: 4.9★ (12+ ulasan)

---

## 🚀 Fitur Unggulan

1. **Cinematic Scroll Sequence (Hero Section)**
   - Transisi *clip-path* meluas dari kartu hero menjadi layar penuh tanpa jeda framing.
   - *Dolly zoom* halus ke dalam cangkir kopi.
   - Efek sapuan gelombang (*wave splash*) dipadukan simulasi partikel tetes kopi pada HTML5 Canvas 2D yang adaptif terhadap kapabilitas perangkat.
   - 3D mouse tilt pada featured cards.

2. **Katalog Menu Terpusat & Dinamis (`menu.json`)**
   - 4 kategori menu: Coffee, Non-Coffee, Makanan, dan Cemilan (27+ item).
   - Pengelolaan harga dan menu terpusat di `src/data/menu.json` tanpa perlu mengubah kode komponen.
   - Label penanda menu favorit (`fav: true`) dan catatan rasa/opsi (`note`).

3. **Pemesanan Cepat via WhatsApp (Keranjang Belanja Interaktif)**
   - State management keranjang menggunakan Zustand (`cart-store.ts`).
   - Stepper jumlah kuantitas `[ - qty + ]` inline pada baris menu dan kartu featured.
   - Bar mengambang (*floating cart bar*) menampilkan total belanjaan secara real-time.
   - Sheet rincian pesanan dengan formulir nama pemesan, metode (Dine-in / Take Away), dan catatan khusus.
   - Otomatis membuat tautan `wa.me` dengan format pesan pesanan terstruktur.

4. **Galeri Foto Asli & Lightbox Responsif**
   - Menampilkan foto asli interior bar, suasana malam, dan menu produk.
   - Filter kategori: Semua, Suasana, dan Menu.
   - Lightbox modal dengan animasi GSAP, navigasi keyboard (Esc, panah kiri/kanan), touch swipe pada mobile, dan penguncian scroll Lenis otomatis.

5. **Ulasan Google Live dengan Fallback Cerdas**
   - Integrasi API Google Places (New v1) melalui Next.js Route Handler (`/api/google-reviews`).
   - Caching respons selama 12 jam untuk menghemat kuota API.
   - Fallback otomatis ke ulasan kurasi statis jika kredensial belum dikonfigurasi, memastikan tampilan tidak pernah kosong atau error.

6. **SEO Lokal & PWA Ready**
   - Schema.org Structured Data (`CafeOrCoffeeShop`) untuk memperkuat peringkat pencarian Google lokal di area Cibitung/Bekasi.
   - Dynamic sitemap (`sitemap.ts`) dan dynamic robots policy (`robots.ts`).
   - OpenGraph metadata lengkap dengan kartu pratinjau media sosial (`og.jpg`).
   - File manifest PWA (`manifest.ts`) dengan ikon maskable untuk instalasi di layar beranda ponsel pengguna.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, standalone output support)
- **Runtime & Package Manager**: Node.js 20+ / Bun
- **Bahasa**: TypeScript 5
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/postcss`
- **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/) (berbasis Radix UI primitives)
- **Animasi**: [GSAP 3.15](https://gsap.com/) (ScrollTrigger) & [Lenis 1.3.27](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **State Management**: [Zustand 5](https://zustand.docs.pmnd.rs/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Font**: Anton (Headline Display) & Plus Jakarta Sans (Body) via `next/font/google`

---

## 📁 Struktur Direktori

```text
SecHome/
├── public/
│   ├── icons/                 # Ikon PWA (192px, 512px maskable)
│   ├── images/                # Foto asli kedai (interior, menu, eksterior) & visual hero
│   ├── logo.svg               # Vektor logo
│   └── og.jpg                 # Pratinjau Open Graph (1200x630)
├── scripts/
│   ├── process-logo.js        # Skrip otomatis penghapus background logo & ekstraksi favicon
│   └── process-photos.js      # Skrip optimalisasi, pemotongan, dan pembuatan aset PWA/OG
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── google-reviews/ # Endpoint sinkronisasi ulasan Google Places API
│   │   ├── apple-icon.png     # Ikon perangkat Apple
│   │   ├── globals.css        # Variabel tema, keyframe animasi, dan konfigurasi Lenis
│   │   ├── icon.png           # Favicon aplikasi
│   │   ├── layout.tsx         # Root layout, injeksi font, SEO, dan JSON-LD
│   │   ├── loading.tsx        # Indikator loading bernuansa brand
│   │   ├── manifest.ts        # Dynamic Web App Manifest (PWA)
│   │   ├── not-found.tsx      # Halaman 404 custom
│   │   ├── page.tsx           # Halaman utama landing page
│   │   ├── robots.ts          # Dynamic robots.txt
│   │   └── sitemap.ts         # Dynamic sitemap.xml
│   ├── components/
│   │   ├── landing/           # Komponen landing page
│   │   │   ├── about.tsx        # Bagian tentang & fasilitas kedai
│   │   │   ├── cart-bar.tsx     # Bar mengambang & drawer checkout
│   │   │   ├── cart-store.ts    # Store Zustand keranjang & generator tautan WA
│   │   │   ├── data.ts          # Konstanta profil, jam operasional, dan import menu
│   │   │   ├── floating-wa.tsx  # Tombol bantuan WhatsApp cepat
│   │   │   ├── footer.tsx       # Footer informasi & hak cipta
│   │   │   ├── gallery.tsx      # Galeri foto dengan modal lightbox
│   │   │   ├── hero.tsx         # Panggung animasi sinematik
│   │   │   ├── location.tsx     # Peta embed Google Maps & jam buka
│   │   │   ├── marquee.tsx      # Teks pita berjalan brand
│   │   │   ├── menu-section.tsx # Daftar menu dengan tab kategori & stepper
│   │   │   ├── navbar.tsx       # Navigasi sticky responsif
│   │   │   ├── promo.tsx        # Highlight promo (Modal 10rb, Mahasiswa, Nobar)
│   │   │   ├── reveal.tsx       # Wrapper animasi ScrollTrigger
│   │   │   ├── smooth-scroll.tsx# Inisialisasi Lenis & sinkronisasi GSAP ticker
│   │   │   ├── splash-canvas.tsx# Simulasi partikel kopi 2D Canvas
│   │   │   ├── testimonials.tsx # Tampilan kartu review Google
│   │   │   └── tilt-card.tsx    # Efek 3D tilt kartu menu
│   │   └── ui/                # Komponen primitive Radix/shadcn
│   ├── data/
│   │   └── menu.json          # Sumber data tunggal untuk seluruh item menu
│   └── lib/
│       ├── db.ts              # Konfigurasi Prisma client (opsional / ekstensi)
│       └── utils.ts           # Helper kelas styling (cn)
├── components.json            # Konfigurasi shadcn/ui
├── next.config.ts             # Pengaturan Next.js
├── package.json               # Dependensi & script proyek
└── worklog.md                 # Rekam jejak riwayat pengembangan per tahap
```

---

## ⚙️ Menjalankan Proyek Secara Lokal

### 1. Kebutuhan Sistem
- [Node.js](https://nodejs.org/) v20+ atau [Bun](https://bun.sh/)
- npm / pnpm / bun

### 2. Instalasi Dependensi
```bash
npm install
# atau
bun install
```

### 3. Konfigurasi Lingkungan (`.env`)
Buat atau salin file konfigurasi lingkungan:
```bash
cp .env.example .env
```
Isi variabel berikut:
```env
# Domain produksi untuk canonical URL & sitemap
NEXT_PUBLIC_SITE_URL=https://www.secondhomecoffee.id

# (Opsional) Google Places API New v1 untuk ulasan real-time
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
```
> *Catatan: Jika variabel Google Places dikosongkan, sistem otomatis menggunakan ulasan kurasi bawaan.*

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
# atau
bun dev
```
Buka browser di `http://localhost:3000`.

### 5. Memeriksa Kualitas Kode & Build Produksi
```bash
# Validasi linter
npm run lint

# Kompilasi build produksi
npm run build

# Menjalankan build lokal
npm run start
```

---

## 📖 Panduan Pemeliharaan untuk Pengelola Kedai

### 1. Mengubah / Menambah Item Menu
Buka file `src/data/menu.json`:
- Harga ditulis dalam satuan ribuan rupiah (`15` berarti `Rp15.000`).
- Format item:
  ```json
  {
    "name": "Kopi Susu Pandan",
    "price": 18,
    "fav": true,
    "note": "Aroma pandan wangi, creamy pas"
  }
  ```
- Kategori yang tersedia: `coffee`, `noncoffee`, `makanan`, dan `cemilan`.

### 2. Mengubah Nomor WhatsApp & Info Kontak
Buka file `src/components/landing/data.ts` dan perbarui objek `BRAND`:
```typescript
export const BRAND = {
  phoneDisplay: "0813-6020-2396",
  phoneWa: "6281360202396", // Gunakan format internasional tanpa tanda +
  instagram: "scndhomecoffee",
  instagramUrl: "https://instagram.com/scndhomecoffee",
  // ...
};
```

### 3. Mengubah Jam Operasional
Buka `src/components/landing/data.ts` dan sesuaikan array `HOURS`:
```typescript
export const HOURS = [
  { day: "Senin – Jumat", time: "09.00 – 23.00 WIB" },
  { day: "Sabtu – Minggu", time: "14.00 – 23.00 WIB" },
];
```

---

## 🚢 Panduan Deployment

### Deploy ke Vercel (Rekomendasi)
1. Hubungkan repositori GitHub/GitLab ke Vercel.
2. Vercel akan secara otomatis mendeteksi framework **Next.js**.
3. Tambahkan environment variable pada pengaturan proyek di Vercel:
   - `NEXT_PUBLIC_SITE_URL` = URL domain produksi resmi.
   - `GOOGLE_PLACES_API_KEY` & `GOOGLE_PLACE_ID` (jika menggunakan ulasan live).
4. Klik **Deploy**.

---

## 📄 Lisensi
Hak Cipta © 2026 Second Home Coffee Bekasi. Hak cipta dilindungi undang-undang.
