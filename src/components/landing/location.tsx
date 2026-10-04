import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";
import { Reveal } from "./reveal";
import { BRAND, HOURS, SERVICES, waLink } from "./data";

export function Location() {
  return (
    <section
      id="lokasi"
      className="relative scroll-mt-20 overflow-hidden bg-ink bg-grain py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 select-none font-display text-[16vw] leading-none text-outline-cream lg:text-[9vw]"
      >
        MAMPIR
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Info */}
        <div>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Lokasi &amp; Jam Buka
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-cream sm:text-5xl">
              Mampir ke <span className="text-brand">rumah kedua</span>-mu.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-cream/60">
              Kami tepat di pinggir Jl. Raya Setu, mudah dijangkau dari arah
              Cibitung, Setu, maupun Grand Wisata. Parkir motor dan mobil lega
              di depan kedai — mampir duduk santai atau take away juga bisa.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-red-400">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-base uppercase tracking-wide text-cream">
                    Alamat
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-cream/60">
                    {BRAND.address}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-red-400">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div className="w-full max-w-xs">
                  <p className="font-display text-base uppercase tracking-wide text-cream">
                    Jam Buka
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {HOURS.map((h) => (
                      <li
                        key={h.day}
                        className="flex items-baseline gap-2 text-sm"
                      >
                        <span className="font-semibold text-cream/80">
                          {h.day}
                        </span>
                        <span className="leader-dots h-3 flex-1 text-cream/20" aria-hidden />
                        <span className="text-cream/60">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-red-400">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-base uppercase tracking-wide text-cream">
                    Telepon / WhatsApp
                  </p>
                  <a
                    href={`tel:+${BRAND.phoneWa}`}
                    className="mt-0.5 block text-sm font-semibold text-cream/80 transition-colors hover:text-red-400"
                  >
                    {BRAND.phoneDisplay}
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-cream/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream/65"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream shadow-[0_6px_20px_rgba(200,16,46,0.4)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                <Navigation className="h-4 w-4" aria-hidden />
                Buka di Google Maps
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-cream/20 px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:border-cream/50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Chat Kami
              </a>
            </div>
          </Reveal>
        </div>

        {/* Peta */}
        <Reveal delay={0.1}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-brand sm:-right-4 sm:-top-4"
            />
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-cream/10 shadow-2xl" data-lenis-prevent>
              <iframe
                title="Peta lokasi Second Home Coffee Bekasi"
                src={BRAND.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-80 w-full border-0 sm:h-[420px] lg:h-[480px]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
