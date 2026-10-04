"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, MapPin, Wifi, Clock, ArrowRight, Coffee } from "lucide-react";
import { BRAND, waLink } from "./data";
import { SplashCanvas, type SplashPhase } from "./splash-canvas";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const COPY_SELECTOR =
  "[data-hero='badge'],[data-hero='title'],[data-hero='desc'],[data-hero='cta'],[data-hero='stat']";

export function Hero() {
  const root = useRef<HTMLElement | null>(null);
  const cardImgRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const cupRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<SplashPhase>({ active: false, energy: 0 });
  const splashApiRef = useRef<{ wake: () => void } | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ---------- 1) Entrance saat load ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });
      tl.fromTo(
        q("[data-hero='badge']"),
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0 },
        0.05
      )
        .fromTo(
          q("[data-hero='title']"),
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0 },
          0.15
        )
        .fromTo(
          q("[data-hero='desc']"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0 },
          0.3
        )
        .fromTo(
          q("[data-hero='cta']"),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0 },
          0.42
        )
        .fromTo(
          q("[data-hero='stat']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06 },
          0.52
        )
        .fromTo(
          q("[data-hero='image']"),
          { autoAlpha: 0, scale: 0.94, rotate: 2 },
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.85 },
          0.25
        )
        .fromTo(
          q("[data-hero='card-rating']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.78
        )
        .fromTo(
          q("[data-hero='card-price']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.92
        );

      /* ---------- 2) Sekuens sinematik (pin + scrub) ---------- */
      const zoom = zoomRef.current;
      const imgWrap = imgWrapRef.current;
      const cup = cupRef.current;
      const card = cardImgRef.current;
      if (!zoom || !imgWrap || !cup || !card) return;

      // Dolly zoom mengarah ke pusat cup — bukan ke pinggir gambar
      gsap.set(cup, { transformOrigin: "50% 58%" });

      // Jendela expand: mengukur rect kartu hero asli, lalu clip-path-nya
      // mengembang dari bentuk kartu (rounded-rect) sampai fullscreen —
      // jadi kelanjutan bentuk yang sama, bukan ganti bentuk mendadak.
      const st = { clip: "", tx: 0, ty: 0, k: 1 };
      const measureStage = () => {
        const secRect = el.getBoundingClientRect();
        const img = card.querySelector("img");
        const r = (img ?? card).getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const ccx = r.left - secRect.left + r.width / 2;
        const ccy = r.top - secRect.top + r.height / 2;
        const R_c = Math.max(r.width, r.height); // render cover di kartu
        const R_f = Math.max(vw, vh); // render cover fullscreen
        st.tx = ccx - vw / 2;
        st.ty = ccy - vh / 2;
        st.k = R_c / R_f;
        gsap.set(imgWrap, {
          width: R_f,
          height: R_f,
          left: vw / 2 - R_f / 2,
          top: vh / 2 - R_f / 2,
        });
        const t = Math.max(0, r.top - secRect.top);
        const l = Math.max(0, r.left - secRect.left);
        const rt = Math.max(0, secRect.width - (r.right - secRect.left));
        const b = Math.max(0, secRect.height - (r.bottom - secRect.top));
        st.clip = `inset(${t}px ${rt}px ${b}px ${l}px round 32px)`;
      };
      measureStage();
      tl.eventCallback("onComplete", measureStage);
      window.addEventListener("resize", measureStage);
      ScrollTrigger.addEventListener("refreshInit", measureStage);
      document.fonts?.ready.then(() => measureStage()).catch(() => {});

      const cinema = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            let energy = 0;
            if (p > 0.74 && p < 0.985) {
              const rise = Math.min(1, (p - 0.74) / 0.1);
              const fall = p > 0.94 ? Math.max(0, (0.985 - p) / 0.045) : 1;
              energy = rise * fall;
            }
            phaseRef.current.active = energy > 0;
            phaseRef.current.energy = energy;
            if (energy > 0) splashApiRef.current?.wake();
          },
          onLeave: () => {
            phaseRef.current.active = false;
            phaseRef.current.energy = 0;
          },
          onLeaveBack: () => {
            phaseRef.current.active = false;
            phaseRef.current.energy = 0;
          },
        },
      });

      // FASE A — intro keluar, kopi mulai "mekar" (0 → 0.18)
      cinema.fromTo(
        q("[data-hero='ornament']"),
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -30, duration: 0.1 },
        0
      )
        .fromTo(
          q(COPY_SELECTOR),
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -34, stagger: 0.012, duration: 0.1 },
          0
        )
        .fromTo(
          q("[data-hero='card-rating'],[data-hero='card-price']"),
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -18, duration: 0.08 },
          0
        )
        .fromTo(
          q("[data-hero='image']"),
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.16 },
          0.02
        )
        // FASE B — jendela rounded-rect mengembang dari kartu ke fullscreen
        // + dolly zoom ke dalam cup (0.05 → 0.88)
        .fromTo(
          q("[data-hero='stage-bg']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.34 },
          0.1
        )
        .set(zoom, { autoAlpha: 1 }, 0.05)
        .fromTo(
          zoom,
          { clipPath: () => st.clip },
          {
            clipPath: "inset(0px 0px 0px 0px round 0px)",
            duration: 0.48,
            ease: "power2.inOut",
          },
          0.05
        )
        .fromTo(
          imgWrap,
          { x: () => st.tx, y: () => st.ty, scale: () => st.k },
          { x: 0, y: 0, scale: 1, duration: 0.48, ease: "power2.inOut" },
          0.05
        )
        .fromTo(
          cup,
          { scale: 1 },
          { scale: 1.45, duration: 0.83, ease: "sine.inOut" },
          0.05
        )
        // FASE C — scrim menggelap dulu, baru tagline masuk (0.50 → 0.65)
        .fromTo(
          q("[data-hero='scrim']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.12, ease: "power1.out" },
          0.5
        )
        .fromTo(
          q("[data-hero='tagline']"),
          { autoAlpha: 0, y: 46, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.12 },
          0.53
        )
        // FASE D — wave kopi menyapu + partikel splash (0.74 → 0.92)
        .fromTo(
          q("[data-hero='wave']"),
          { y: () => window.innerHeight * 1.6, autoAlpha: 1 },
          { y: 0, autoAlpha: 1, duration: 0.18, ease: "power2.out" },
          0.74
        )
        .to(
          q("[data-hero='tagline']"),
          { autoAlpha: 0, y: -30, scale: 1.05, duration: 0.07 },
          0.86
        )
        // FASE E — penutup elegan: logo brand (0.92 → 1)
        .fromTo(
          q("[data-hero='end-logo']"),
          { autoAlpha: 0, y: 26, scale: 0.9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.07, ease: "power3.out" },
          0.92
        )
        .to({}, { duration: 0.01 }, 0.99);

      return () => {
        window.removeEventListener("resize", measureStage);
        ScrollTrigger.removeEventListener("refreshInit", measureStage);
      };
    });

    /* ---------- 3) Kartu mengambang: cuma di layar >= md ---------- */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(q("[data-float='rating']"), {
          y: -8,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(q("[data-float='price']"), {
          y: 6,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.5,
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="beranda"
      ref={root}
      className="relative overflow-hidden bg-cream bg-dots-dark pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* Ornamen teks raksasa */}
      <div
        aria-hidden
        data-hero="ornament"
        className="pointer-events-none absolute -bottom-6 left-0 select-none font-display text-[18vw] leading-none text-outline-ink md:text-[13vw]"
      >
        SECOND HOME
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Kolom teks */}
        <div>
          <div data-hero="badge">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink/70 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
              Cibitung, Bekasi — Buka tiap hari s/d 23.00
            </span>
          </div>

          <h1
            data-hero="title"
            className="mt-5 font-display text-[2.9rem] uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            Ngopi di{" "}
            <span className="relative inline-block text-brand">
              rumah
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 220 12"
                fill="none"
                aria-hidden
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C60 3 150 3 217 8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="opacity-40"
                />
              </svg>
            </span>{" "}
            <span className="relative inline-block text-brand">keduamu.</span>
          </h1>

          <p
            data-hero="desc"
            className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg"
          >
            <strong className="font-bold text-ink">Premium taste, pocket friendly price.</strong>{" "}
            Kopi enak mulai 5 ribuan, WiFi kenceng, area santai buat ngerjain
            tugas atau sekadar rebahan otak. Di Second Home, kamu nggak cuma
            dilayani — kamu juga disambut kayak pulang.
          </p>

          <div
            data-hero="cta"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-[0_6px_20px_rgba(200,16,46,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Lihat Menu
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-card px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
            >
              Pesan via WhatsApp
            </a>
          </div>

          {/* Statistik singkat */}
          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: Star,
                value: "4.9/5",
                label: "Rating Google",
              },
              {
                icon: Coffee,
                value: "5K–17K",
                label: "Harga menu",
              },
              {
                icon: Clock,
                value: "23.00",
                label: "Tutup tiap hari",
              },
              {
                icon: Wifi,
                value: "Gratis",
                label: "WiFi nongkrong",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="rounded-2xl border border-ink/8 bg-card/80 px-4 py-3 shadow-sm"
              >
                <stat.icon className="h-4 w-4 text-brand" aria-hidden />
                <dt className="sr-only">{stat.label}</dt>
                <dd className="mt-1.5 font-display text-lg leading-none text-ink">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Kolom gambar */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div data-hero="image" className="relative">
            {/* Blok merah offset */}
            <div
              aria-hidden
              className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-brand sm:-right-5 sm:-top-5"
            />
            <div
              ref={cardImgRef}
              className="relative overflow-hidden rounded-[2rem] border-4 border-ink shadow-[10px_10px_0_rgba(20,16,16,0.9)]"
            >
              <Image
                src="/images/hero-coffee.png"
                alt="Es kopi susu gula aren khas Second Home Coffee di atas meja kayu"
                width={1024}
                height={1024}
                priority
                className="h-[420px] w-full object-cover sm:h-[520px] md:h-[560px]"
              />
            </div>
          </div>

          {/* Kartu rating */}
          <div
            data-hero="card-rating"
            className="absolute -left-4 top-8 sm:-left-8"
          >
            <div
              data-float="rating"
              className="rounded-2xl border border-ink/10 bg-card/95 px-4 py-3 shadow-lg backdrop-blur"
            >
              <div className="flex items-center gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < 5 ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs font-bold text-ink">
                {BRAND.rating} di Google
              </p>
              <p className="text-[11px] text-ink/55">
                {BRAND.reviewCount} ulasan
              </p>
            </div>
          </div>

          {/* Kartu harga */}
          <div data-hero="card-price" className="absolute -bottom-5 left-6">
            <div
              data-float="price"
              className="rounded-2xl bg-ink px-5 py-3 text-cream shadow-xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                Kopi signature
              </p>
              <p className="font-display text-xl leading-tight">
                Gula Aren — <span className="text-brand">15K</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          PANGGUNG SINEMATIK — hidup saat hero di-pin & di-scrub:
          jendela kartu mengembang → fullscreen + cup zoom dolly → tagline
          → wave splash → penutup logo. Semua transform/opacity/clip-path
          saja (60fps aman).
      ============================================================ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      >
        {/* Latar merah deep yang menyala saat iris mekar */}
        <div
          data-hero="stage-bg"
          className="absolute inset-0 bg-brand-deep"
          style={{ opacity: 0, visibility: "hidden" }}
        />

        {/* Jendela expand — rounded-rect tumbuh dari kartu hero ke fullscreen */}
        <div
          ref={zoomRef}
          aria-hidden
          className="absolute inset-0 z-[5] overflow-hidden will-change-[clip-path]"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div
            ref={imgWrapRef}
            className="absolute left-0 top-0 will-change-transform"
          >
            <div ref={cupRef} className="h-full w-full will-change-transform">
              <Image
                src="/images/hero-coffee.png"
                alt=""
                width={1024}
                height={1024}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Scrim gelap — mendahului tagline agar teks selalu kontras di atas cup terang */}
        <div
          data-hero="scrim"
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,16,16,0.8)_22%,rgba(20,16,16,0.42)_56%,rgba(20,16,16,0.08)_78%)]" />
        </div>

        {/* Tagline di atas kopi */}
        <div
          data-hero="tagline"
          className="absolute inset-x-0 top-0 z-20 grid h-[100svh] place-items-center px-6 text-center"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div>
            <p className="relative text-[10px] font-bold uppercase tracking-[0.45em] text-cream/75 sm:text-xs">
              ✦ Second Home Coffee ✦
            </p>
            <p className="relative mt-4 font-display text-[13vw] uppercase leading-[0.95] text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] md:text-[7.5vw]">
              Premium taste,
            </p>
            <p className="relative font-display text-[13vw] uppercase leading-[0.95] text-outline-cream md:text-[7.5vw]">
              pocket friendly price.
            </p>
          </div>
        </div>

        {/* Partikel tetes kopi (canvas) */}
        <SplashCanvas phaseRef={phaseRef} apiRef={splashApiRef} />

        {/* Wave kopi — tirai penutup sinematik (tersembunyi pre-JS via opacity) */}
        <div
          data-hero="wave"
          className="absolute inset-x-0 bottom-0 z-30 h-[135%]"
          style={{ opacity: 0 }}
        >
          <svg
            className="absolute inset-x-0 top-0 h-[30%] w-full translate-y-[2.5%]"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,72 C200,16 420,132 720,80 C1020,28 1240,140 1440,72 L1440,160 L0,160 Z"
              fill="#6d0718"
            />
          </svg>
          <svg
            className="absolute inset-x-0 top-0 h-[30%] w-full"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,96 C240,36 480,156 720,96 C960,36 1200,156 1440,96 L1440,160 L0,160 Z"
              fill="#c8102e"
            />
          </svg>
          <svg
            className="absolute inset-x-0 top-0 h-[30%] w-full"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,96 C240,36 480,156 720,96 C960,36 1200,156 1440,96"
              fill="none"
              stroke="#f6f1e7"
              strokeOpacity="0.45"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 top-[26%] bg-brand" />
        </div>

        {/* Penutup elegan: logo brand */}
        <div
          data-hero="end-logo"
          className="absolute inset-x-0 top-0 z-40 grid h-[100svh] place-items-center px-6"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-cream/15 bg-ink/45 px-10 py-8 text-center backdrop-blur-sm">
            <Image
              src="/images/logo.png"
              alt=""
              width={442}
              height={512}
              className="h-20 w-auto"
            />
            <p className="font-display text-2xl uppercase tracking-wide text-cream sm:text-3xl">
              Second Home Coffee
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cream/60 sm:text-xs">
              Cibitung · Bekasi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
