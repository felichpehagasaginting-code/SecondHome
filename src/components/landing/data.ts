import menuJson from "@/data/menu.json";

// Domain produksi — UPDATE setelah deploy ke hosting (mis. Vercel + domain sendiri).
export const SITE_URL = "https://www.secondhomecoffee.id";

export const BRAND = {
  name: "Second Home Coffee",
  city: "Bekasi",
  tagline: "Premium taste, pocket friendly price",
  address:
    "Jl. Raya Setu, Cibuntu, Cibitung, Kabupaten Bekasi, Jawa Barat 17520",
  phoneDisplay: "0813-6020-2396",
  phoneWa: "6281360202396",
  instagram: "scndhomecoffee",
  instagramUrl: "https://instagram.com/scndhomecoffee",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Second+Home+Coffee+Bekasi",
  mapsEmbed:
    "https://www.google.com/maps?q=Second%20Home%20Coffee%20Bekasi&output=embed",
  rating: "4.9",
  reviewCount: 12,
};

export const HOURS = [
  { day: "Senin – Jumat", time: "09.00 – 23.00 WIB" },
  { day: "Sabtu – Minggu", time: "14.00 – 23.00 WIB" },
];

export const SERVICES = ["Dine-in", "Take Away"];

export const WA_MESSAGE = encodeURIComponent(
  "Halo Second Home Coffee! Mau tanya-tanya soal menu & promo, boleh?"
);

export const waLink = `https://wa.me/${BRAND.phoneWa}?text=${WA_MESSAGE}`;

export type MenuItem = {
  name: string;
  price: number;
  note?: string;
  fav?: boolean;
};

export type MenuCategory = "coffee" | "noncoffee" | "makanan" | "cemilan";

type MenuData = Record<MenuCategory, MenuItem[]>;

/**
 * Menu bersumber dari src/data/menu.json (single source of truth).
 * Untuk update menu/harga: edit file JSON-nya saja, tanpa sentuh komponen.
 * Harga dalam ribuan rupiah (15 = Rp15.000).
 */
const menuSource = menuJson as unknown as MenuData & { _cara_pakai?: string };

export const MENU: MenuData = {
  coffee: menuSource.coffee ?? [],
  noncoffee: menuSource.noncoffee ?? [],
  makanan: menuSource.makanan ?? [],
  cemilan: menuSource.cemilan ?? [],
};

export const FEATURED = [
  {
    name: "Palm Sugar Latte",
    id: "Kopi Susu Gula Aren",
    price: 15,
    image: "/images/menu-gulaaren.png",
    tag: "Signature",
    desc: "Gula aren asli yang melimpah, susu creamy, espresso pekat. Paling dicari di Second Home.",
  },
  {
    name: "Matcha Latte",
    id: null,
    price: 15,
    image: "/images/menu-matcha.png",
    tag: "Best Seller",
    desc: "Matcha aromatik dengan susu segar, manisnya pas buat yang nggak ngopi kafein.",
  },
  {
    name: "Butterscotch Latte",
    id: "Butterscotch Sea Salt Latte",
    price: 17,
    image: "/images/menu-butterscotch.png",
    tag: "Favorit Baru",
    desc: "Manis gurih butterscotch dengan sentuhan sea salt — nagih di tegukan pertama.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Cevyan Chahya",
    stars: 5,
    time: "4 bulan lalu",
    role: "Local Guide",
    text: "Kopinya enak, tempatnya juga enak buat santai. Cocok buat tempat nongkrong paling nyaman.",
  },
  {
    name: "Agung",
    stars: 5,
    time: "3 bulan lalu",
    role: "Google Review",
    text: "Recommended banget buat teman-teman. Saran sedikit: kalau smoking area-nya diberi speaker bakal makin asik.",
  },
  {
    name: "Jarwo Sopo",
    stars: 4,
    time: "2 bulan lalu",
    role: "Google Review",
    text: "Kopi sama makanannya enak. Cuma buat saya tutupnya terasa cepat — pas asik-ngasiknya ngopi jam 10 malam.",
  },
];

export const MARQUEE_ITEMS = [
  "Kopi Susu Gula Aren 15K",
  "Premium Taste",
  "Pocket Friendly Price",
  "WiFi Gratis",
  "Nobar Timnas",
  "Dine-in & Take Away",
  "Smoking Area",
  "Buka Sampai 23.00",
];
