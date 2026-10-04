import Image from "next/image";
import { BadgePercent, Wallet, Instagram, Users, CalendarDays, Megaphone } from "lucide-react";
import { Reveal } from "./reveal";
import { BRAND } from "./data";

export function Promo() {
  return (
    <section
      id="promo"
      className="relative scroll-mt-20 overflow-hidden bg-brand bg-dots-light py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 bottom-0 select-none font-display text-[16vw] leading-none text-outline-cream lg:text-[9vw]"
      >
        PROMO
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cream">
            <Megaphone className="h-3.5 w-3.5" aria-hidden />
            Promo &amp; Acara
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream sm:text-5xl md:text-6xl">
            Katanya mahasiswa? <br className="hidden sm:block" />
            Di sini kamu <span className="text-cream/70">tetep bisa ngopi.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Promo 10rb */}
          <Reveal>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 text-cream shadow-xl transition-transform hover:-translate-y-1 md:p-10">
              <Wallet
                className="absolute -bottom-6 -right-6 h-36 w-36 text-cream/5"
                aria-hidden
              />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                  <BadgePercent className="h-3.5 w-3.5" aria-hidden />
                  Promo Berjalan
                </span>
                <h3 className="mt-4 font-display text-3xl uppercase leading-[0.95] sm:text-4xl">
                  &ldquo;Modal 10rb udah bisa{" "}
                  <span className="text-brand">ngopi!</span>&rdquo;
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-cream/65">
                  Dompet tanggal tua bukan alasan buat berhenti ngopi. Dengan
                  sepuluh ribuan, kamu udah bisa bawa pulang kopi susu gula
                  aren signature kami — yang biasanya cuma jadi story Instagram
                  orang lain.
                </p>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-cream/40">
                *Syarat &amp; ketentuan berlaku — cek detail di Instagram kami
              </p>
            </article>
          </Reveal>

          {/* Promo mahasiswa baru */}
          <Reveal delay={0.1}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-cream p-8 shadow-xl transition-transform hover:-translate-y-1 md:p-10">
              <Instagram
                className="absolute -bottom-6 -right-6 h-36 w-36 text-ink/5"
                aria-hidden
              />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cream">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  Khusus Adik Kelas
                </span>
                <h3 className="mt-4 font-display text-3xl uppercase leading-[0.95] text-ink sm:text-4xl">
                  Diskon <span className="text-brand">mahasiswa baru</span>
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-ink/70">
                  Baru masuk kampus di sekitar Cibitung? Selamat! Sebagai
                  &ldquo;kopi pertama&rdquo;-mu di kota ini, kami kasih potongan
                  khusus buat kamu — cukup bawa kartu mahasiswa dan tunjukkan
                  saat memesan di kasir.
                </p>
              </div>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand underline-offset-4 hover:underline"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                Cek syarat lengkap di @scndhomecoffee
              </a>
            </article>
          </Reveal>
        </div>

        {/* Nobar */}
        <Reveal delay={0.1} className="mt-6">
          <article className="relative overflow-hidden rounded-3xl shadow-xl">
            <div className="relative h-72 sm:h-96">
              <Image
                src="/images/nobar.png"
                alt="Suasana nobar pertandingan sepak bola bersama di teras Second Home Coffee"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cream">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                Event Rutin
              </span>
              <h3 className="mt-4 max-w-md font-display text-3xl uppercase leading-[0.95] text-cream sm:text-4xl md:text-5xl">
                Nobar tanding <span className="text-brand">timnas</span>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/75 sm:text-base">
                Tiap timnas main, teras kami berubah jadi tribun kedua. Layar
                besar, kursi santai, kopi nggak pernah habis. Seperti nobar
                PIALA AFF kemarin — datang lebih awal biar dapet kursi depan.
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
