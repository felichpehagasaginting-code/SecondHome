import type { Metadata, Viewport } from "next";
import { Anton, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BRAND, SITE_URL } from "@/components/landing/data";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const SITE_NAME = "Second Home Coffee Bekasi";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium Taste, Pocket Friendly Price`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Tempat nongkrong kedua di Cibitung, Bekasi. Kopi premium harga ramah kantong mulai 5 ribuan. WiFi gratis, banyak colokan, area santai, smoking area, dan nobar seru. Buka setiap hari sampai 23.00 WIB di Jl. Raya Setu, Cibuntu.",
  keywords: [
    "second home coffee",
    "second home coffee bekasi",
    "coffee shop cibitung",
    "cafe cibitung",
    "kedai kopi cibitung",
    "kopi bekasi",
    "cafe murah bekasi",
    "tempat nongkrong cibitung",
    "tempat nongkrong bekasi",
    "kopi gula aren bekasi",
    "kopi gula aren cibitung",
    "es kopi susu cibitung",
    "nobar bekasi",
    "nobar timnas cibitung",
    "coffee shop grand wisata",
    "cafe setu bekasi",
    "wifi gratis cibitung",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — Premium Taste, Pocket Friendly Price`,
    description:
      "Tempat nongkrong kedua di Cibitung, Bekasi. Kopi premium mulai 5 ribuan, WiFi gratis banyak colokan, buka tiap hari s/d 23.00.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Second Home Coffee Bekasi — Premium taste, pocket friendly price",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Premium Taste, Pocket Friendly Price`,
    description:
      "Kopi premium mulai 5 ribuan di Cibitung, Bekasi. WiFi gratis, buka s/d 23.00.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Cafe / Coffee Shop",
};

export const viewport: Viewport = {
  themeColor: "#c8102e",
  width: "device-width",
  initialScale: 1,
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${SITE_URL}/#kedai`,
  name: SITE_NAME,
  slogan: "Premium taste, pocket friendly price",
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  logo: `${SITE_URL}/icons/icon-512.png`,
  telephone: "+62 813-6020-2396",
  priceRange: "Rp5.000 – Rp17.000",
  currenciesAccepted: "IDR",
  paymentAccepted: "Cash, QRIS, Transfer Bank",
  servesCuisine: ["Kopi", "Non-Coffee", "Makanan ringan", "Cemilan"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Raya Setu, Cibuntu",
    addressLocality: "Cibitung",
    addressRegion: "Jawa Barat",
    postalCode: "17520",
    addressCountry: "ID",
  },
  sameAs: [BRAND.instagramUrl, BRAND.mapsUrl],
  hasMenu: `${SITE_URL}/#menu`,
  acceptsReservations: "False",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: BRAND.rating,
    reviewCount: String(BRAND.reviewCount),
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "14:00",
      closes: "23:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${jakarta.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
