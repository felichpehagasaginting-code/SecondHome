import Image from "next/image";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { BRAND, HOURS, waLink } from "./data";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="h-1 w-full bg-brand" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo Second Home Coffee"
              width={442}
              height={512}
              className="h-14 w-auto"
            />
            <span className="leading-tight">
              <span className="block font-display text-base tracking-wide">
                SECOND HOME
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
                Coffee · Bekasi
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/55">
            &ldquo;{BRAND.tagline}.&rdquo; Tempat nongkrong kedua di Cibitung
            untuk kamu yang butuh kopi enak, suasana hangat, dan ruang buat
            jadi diri sendiri.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${BRAND.name}`}
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-cream"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Second Home Coffee"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-cream"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>

        {/* Jam buka */}
        <nav aria-label="Informasi jam buka">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-cream/80">
            Jam Buka
          </h3>
          <ul className="mt-4 space-y-2.5">
            {HOURS.map((h) => (
              <li key={h.day} className="text-sm">
                <span className="block font-semibold text-cream/75">{h.day}</span>
                <span className="text-cream/50">{h.time}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kontak */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-cream/80">
            Hubungi Kami
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-cream/55">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="leading-relaxed">{BRAND.address}</span>
            </li>
            <li>
              <a
                href={`tel:+${BRAND.phoneWa}`}
                className="font-semibold text-cream/75 transition-colors hover:text-brand"
              >
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cream/75 transition-colors hover:text-brand"
              >
                @{BRAND.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-cream/40 sm:px-6">
          <p>© 2026 {BRAND.name} Bekasi. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
