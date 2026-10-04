"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  Instagram,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Reveal } from "./reveal";
import { BRAND } from "./data";

type Category = "suasana" | "menu";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  badge: string;
  category: Category;
  w: number;
  h: number;
};

/**
 * Foto ASLI kedai (bukan ilustrasi) — sumber: pemilik Second Home Coffee.
 * Ganti/tambah foto cukup edit array ini.
 */
const PHOTOS: Photo[] = [
  {
    src: "/images/real-gula-aren.jpg",
    alt: "Kopi susu gula aren signature Second Home Coffee dalam gelas kaca",
    caption: "Kopi Susu Gula Aren — signature paling dicari",
    badge: "Signature 15K",
    category: "menu",
    w: 380,
    h: 494,
  },
  {
    src: "/images/real-matcha.jpg",
    alt: "Matcha Latte dengan cup label merah Second Home Coffee di atas meja kedai",
    caption: "Matcha Latte — favorit yang nggak ngopi kafein",
    badge: "Best Seller",
    category: "menu",
    w: 380,
    h: 494,
  },
  {
    src: "/images/real-spark.jpg",
    alt: "Spark Americano, Americano berkarbonasi dengan lemon dan es",
    caption: "Spark Americano — segar, ada fizz-nya",
    badge: "Menu Baru",
    category: "menu",
    w: 380,
    h: 494,
  },
  {
    src: "/images/real-cup-tangan.jpg",
    alt: "Tangan membawa cup Second Home Coffee dengan logo rumah khas",
    caption: "Bawa pulang favoritmu — take away selalu siap",
    badge: "Take Away",
    category: "menu",
    w: 380,
    h: 494,
  },
  {
    src: "/images/real-eksterior.jpg",
    alt: "Papan nama Second Home Coffee menyala merah di malam hari",
    caption: "Kedai kami di Jl. Raya Setu — gampang dilihat dari jalan",
    badge: "Depan kedai",
    category: "suasana",
    w: 1100,
    h: 699,
  },
  {
    src: "/images/real-interior-bar.jpg",
    alt: "Interior kedai dengan tulisan Take Your Coffee, pastry display, dan WiFi gratis",
    caption: "Bar & pastry corner — sambil nunggu kopi dibuat",
    badge: "Di dalam",
    category: "suasana",
    w: 900,
    h: 1049,
  },
];

const FILTERS = [
  { id: "semua", label: "Semua" },
  { id: "suasana", label: "Suasana" },
  { id: "menu", label: "Menu" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/* ---------------- Lightbox ---------------- */

function Lightbox({
  photos,
  index,
  onClose,
  onNav,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);
  const photo = photos[index];

  // Animasi buka (fade + zoom lembut)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.94, autoAlpha: 0, y: 14 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Ganti foto -> transisi kecil
  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0.35, scale: 0.985 },
      { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, [index]);

  // Keyboard + scroll-lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);

    const lenis = window.__lenis;
    const prevOverflow = document.documentElement.style.overflow;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [onClose, onNav]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} dari ${photos.length}: ${photo.alt}`}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(dx) > 48) onNav(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Tombol tutup */}
      <button
        type="button"
        aria-label="Tutup galeri"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-ink/60 text-cream transition-all hover:border-cream/60 hover:bg-brand"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {/* Nav kiri/kanan (kalau fotonya lebih dari satu) */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-ink/60 text-cream transition-all hover:border-cream/60 hover:bg-brand sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-ink/60 text-cream transition-all hover:border-cream/60 hover:bg-brand sm:right-6"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </>
      )}

      <figure
        ref={contentRef}
        className="flex max-h-full flex-col items-center px-14 py-10 sm:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          sizes="92vw"
          className="h-auto max-h-[72vh] w-auto max-w-full rounded-xl border-4 border-cream/10 object-contain shadow-2xl"
        />
        <figcaption className="mt-4 text-center">
          <p className="font-display text-sm uppercase tracking-wide text-cream sm:text-base">
            {photo.caption}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-cream/45">
            {index + 1} / {photos.length} · @{BRAND.instagram}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

/* ---------------- Grid galeri ---------------- */

export function Gallery() {
  const [filter, setFilter] = useState<FilterId>("semua");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible =
    filter === "semua" ? PHOTOS : PHOTOS.filter((p) => p.category === filter);

  const close = useCallback(() => setLightbox(null), []);
  const nav = useCallback(
    (dir: 1 | -1) =>
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + visible.length) % visible.length
      ),
    [visible.length]
  );

  return (
    <section id="galeri" className="relative scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Galeri Second Home
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl md:text-6xl">
              Intip suasana <span className="text-brand">di rumah kedua.</span>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink/70">
              Ini bukan render atau ilustrasi — semua foto di bawah adalah kedai
              dan menu kami yang sebenarnya. Ketuk fotonya buat lihat lebih
              besar, dan pantau Instagram buat update harian.
            </p>
          </div>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:bg-brand"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            @{BRAND.instagram}
          </a>
        </Reveal>

        {/* Filter kategori */}
        <Reveal delay={0.08} className="mt-8">
          <div
            role="tablist"
            aria-label="Filter galeri"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(f.id);
                    setLightbox(null);
                  }}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    active
                      ? "bg-brand text-cream shadow-[0_4px_14px_rgba(200,16,46,0.35)]"
                      : "border border-ink/15 bg-card text-ink/60 hover:border-brand/50 hover:text-brand"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {visible.map((g, i) => (
            <Reveal key={g.src} delay={0.06 * (i % 3)}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Perbesar foto: ${g.alt}`}
                className="group relative block w-full overflow-hidden rounded-2xl border-4 border-ink shadow-[6px_6px_0_rgba(20,16,16,0.9)]"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={g.w}
                  height={g.h}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="h-7 w-7 text-cream" aria-hidden />
                  <span className="px-3 text-center font-display text-sm uppercase tracking-wider text-cream">
                    {g.badge}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <p className="text-center text-xs text-ink/40">
            Foto asli kedai &amp; menu — terus kami update di Instagram{" "}
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              @{BRAND.instagram}
            </a>
          </p>
        </Reveal>
      </div>

      {lightbox !== null && visible[lightbox] && (
        <Lightbox
          photos={visible}
          index={lightbox}
          onClose={close}
          onNav={nav}
        />
      )}
    </section>
  );
}
