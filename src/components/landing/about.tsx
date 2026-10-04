import Image from "next/image";
import { Wifi, Sofa, CarFront, Tv, BadgeCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { SERVICES } from "./data";

const FEATURES = [
  {
    icon: Wifi,
    title: "WiFi Kenceng, Gratis",
    desc: "Ngerjain tugas, meeting dadakan, atau nge-scroll rebahan — koneksi dijamin aman tanpa keluar biaya.",
  },
  {
    icon: Sofa,
    title: "Area Santai + Smoking Area",
    desc: "Kursi nyaman buat duduk lama, plus smoking area terpisah buat kamu yang butuh napas segar.",
  },
  {
    icon: CarFront,
    title: "Mampir & Parkir Gampang",
    desc: "Tepat di pinggir Jl. Raya Setu — parkir motor dan mobil lega di depan kedai, gampang buat mampir atau take away.",
  },
  {
    icon: Tv,
    title: "Nobar Tiap Ada Timnas",
    desc: "Layar besar, suara jernih, dan semangat bareng — nobar di Second Home selalu penuh kursi.",
  },
];

export function About() {
  return (
    <section id="tentang" className="relative scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        {/* Gambar */}
        <Reveal className="relative order-2 lg:order-1">
          <div
            aria-hidden
            className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] border-4 border-ink"
          />
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src="/images/real-interior-bar.jpg"
              alt="Interior asli Second Home Coffee — bar kedai dengan tulisan Take Your Coffee, pastry display, dan meja tinggi"
              width={900}
              height={1049}
              className="h-72 w-full object-cover sm:h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl bg-cream/90 px-4 py-3 backdrop-blur">
              <BadgeCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden />
              <p className="text-xs font-semibold leading-snug text-ink sm:text-sm">
                Baru dibuka Juni 2026 — tapi udah dapet rating 4.9 di Google
              </p>
            </div>
          </div>
        </Reveal>

        {/* Teks */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Tentang Second Home
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl">
              Ngopi kayak di <span className="text-brand">rumah sendiri.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 leading-relaxed text-ink/70">
              Nama kami bukan sekadar gaya-gayaan. Second Home lahir dari ide
              sederhana: semua orang butuh tempat ketiga setelah rumah dan
              kampus — tempat yang nggak perlu sok formal, harga nggak bikin
              dompet menangis, dan boleh duduk semaunya sampai jam tutup.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Di sudut Jl. Raya Setu, Cibitung, kami sediakan kopi premium
              dengan harga ramah kantong: espresso lima ribuan, kopi susu gula
              aren yang jadi signature, sampai menu makanan buat teman begadang.
              Bawa laptop, bawa tugas, bawa curhatan — semuanya diterima dengan
              hangat kayak di rumah.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink/12 bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Grid fitur */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.08 * i}>
                <div className="group h-full rounded-2xl border border-ink/8 bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-md">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-cream">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
