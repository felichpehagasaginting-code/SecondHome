"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ArrowUpRight, RefreshCw } from "lucide-react";
import { Reveal } from "./reveal";
import { TESTIMONIALS, BRAND } from "./data";
import type { ReviewsPayload } from "@/app/api/google-reviews/route";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Nilai ${count} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count ? "fill-amber-400 text-amber-400" : "text-ink/20"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  // Render awal = data statis (aman SSR & hydration), lalu diperbarui dari API
  // kalau GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID tersedia di server.
  const [data, setData] = useState<ReviewsPayload>({
    source: "static",
    rating: BRAND.rating,
    total: BRAND.reviewCount,
    reviews: TESTIMONIALS.map((t) => ({
      name: t.name,
      stars: t.stars,
      time: t.time,
      role: t.role,
      text: t.text,
    })),
  });

  useEffect(() => {
    let alive = true;
    fetch("/api/google-reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((json: ReviewsPayload | null) => {
        if (alive && json?.source === "google" && json.reviews.length > 0) {
          setData(json);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const isLive = data.source === "google";

  return (
    <section id="testimoni" className="relative scroll-mt-20 bg-cream bg-dots-dark py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Kata Mereka
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl md:text-6xl">
              Yang udah mampir <span className="text-brand">ngomong begini.</span>
            </h2>
          </Reveal>

          {/* Ringkasan rating */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-card px-6 py-4 shadow-sm">
              <span className="font-display text-5xl leading-none text-brand">
                {data.rating}
              </span>
              <div>
                <Stars count={5} />
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
                  {isLive && (
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                    />
                  )}
                  {data.total} ulasan di Google Maps
                  {isLive && (
                    <span className="sr-only">(data live dari Google)</span>
                  )}
                </p>
              </div>
              {isLive && (
                <span
                  className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"
                  title="Rating & ulasan ditarik langsung dari Google Places"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden />
                  Live
                </span>
              )}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {data.reviews.slice(0, 6).map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={0.08 * (i % 3)}>
              <figure className="relative flex h-full flex-col rounded-3xl border border-ink/8 bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Quote
                  className="absolute right-6 top-6 h-8 w-8 text-brand/15"
                  aria-hidden
                />
                <Stars count={t.stars} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/8 pt-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm text-cream">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink/50">
                      {t.role}
                      {t.time ? ` · ${t.time}` : ""}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a
            href={BRAND.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-card px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
          >
            Lihat semua ulasan di Google Maps
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
