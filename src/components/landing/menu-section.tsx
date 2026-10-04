"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Info, Minus, Plus, ShoppingBag } from "lucide-react";
import { MENU, FEATURED, type MenuItem } from "./data";
import { Reveal } from "./reveal";
import { TiltCard } from "./tilt-card";
import { useCart, cartCount, formatRp } from "./cart-store";

function QtyStepper({
  qty,
  onAdd,
  onDec,
  dark = false,
}: {
  qty: number;
  onAdd: () => void;
  onDec: () => void;
  dark?: boolean;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        aria-label="Tambah ke pesanan"
        onClick={onAdd}
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all hover:scale-110 ${
          dark
            ? "bg-cream text-ink hover:bg-brand hover:text-cream"
            : "bg-brand text-cream hover:bg-brand-dark"
        }`}
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center gap-1 rounded-full ${
        dark ? "bg-cream/15" : "bg-brand/15"
      } p-1`}
    >
      <button
        type="button"
        aria-label="Kurangi jumlah"
        onClick={onDec}
        className="grid h-6 w-6 place-items-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-dark"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        className={`min-w-6 text-center font-display text-sm ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        onClick={onAdd}
        className="grid h-6 w-6 place-items-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-dark"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const dec = useCart((s) => s.dec);
  const qty = items[item.name]?.qty ?? 0;

  return (
    <li className="py-2.5">
      <div className="flex items-center gap-3">
        <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-cream/90 sm:text-base">
          {item.name}
          {item.fav && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
              <Flame className="h-3 w-3" aria-hidden />
              Favorit
            </span>
          )}
        </span>
        <span className="leader-dots h-3 flex-1 text-cream/25" aria-hidden />
        <span className="font-display text-base text-cream sm:text-lg">
          <span className="mr-1 text-xs text-cream/50">Rp</span>
          {(item.price * 1000).toLocaleString("id-ID")}
        </span>
        <QtyStepper
          qty={qty}
          onAdd={() => add({ name: item.name, price: item.price })}
          onDec={() => dec(item.name)}
        />
      </div>
      {item.note && (
        <p className="mt-0.5 text-xs italic text-cream/45">{item.note}</p>
      )}
    </li>
  );
}

export function MenuSection() {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const dec = useCart((s) => s.dec);

  const categories = [
    { key: "coffee", label: "Coffee" },
    { key: "noncoffee", label: "Non-Coffee" },
    { key: "makanan", label: "Makanan" },
    { key: "cemilan", label: "Cemilan" },
  ] as const;

  return (
    <section
      id="menu"
      className="relative scroll-mt-20 overflow-hidden bg-ink bg-grain py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-8 select-none font-display text-[16vw] leading-none text-outline-cream lg:text-[9vw]"
      >
        OUR MENU
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
            Menu Second Home
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-cream sm:text-5xl md:text-6xl">
            Modal seribu lima, <span className="text-brand">rasa juara.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-cream/60">
            Semua menu diseduh fresh setiap pesanan masuk. Mulai dari espresso
            tegas sampai susu manis gula aren — ada buat setiap mood dan setiap
            isi dompet. Tekan tombol{" "}
            <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-brand align-middle text-cream">
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </span>{" "}
            buat masukin ke pesananmu!
          </p>
        </Reveal>

        {/* Kartu unggulan */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURED.map((item, i) => {
            const qty = items[item.name]?.qty ?? 0;
            return (
              <Reveal key={item.name} delay={0.1 * i}>
                <TiltCard max={8} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-cream/10 bg-ink-soft shadow-lg transition-all hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-2xl">
                  <div className="relative h-60 overflow-hidden sm:h-72">
                    <Image
                      src={item.image}
                      alt={`${item.name} — ${item.desc}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-brand px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cream shadow-md">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-xl uppercase tracking-wide text-cream">
                        {item.name}
                      </h3>
                      <span className="shrink-0 rounded-lg bg-cream/10 px-3 py-1 font-display text-lg text-brand">
                        {item.price}K
                      </span>
                    </div>
                    {item.id && (
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-cream/40">
                        {item.id}
                      </p>
                    )}
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-cream/60">
                      {item.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-cream/45">
                        {qty > 0
                          ? `${cartCount({ [item.name]: { ...item, qty } })} di pesanan`
                          : "Pesan sekarang"}
                      </span>
                      <QtyStepper
                        dark
                        qty={qty}
                        onAdd={() => add({ name: item.name, price: item.price })}
                        onDec={() => dec(item.name)}
                      />
                    </div>
                  </div>
                </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Tab menu lengkap */}
        <Reveal className="mt-14">
          <Tabs defaultValue="coffee" className="w-full">
            <TabsList className="mx-auto flex h-auto w-full max-w-2xl flex-wrap justify-center gap-1 rounded-2xl border border-cream/12 bg-ink-soft p-1.5 sm:flex-nowrap">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.key}
                  value={c.key}
                  className="flex-1 rounded-xl px-3 py-2.5 font-display text-sm uppercase tracking-wider text-cream/60 transition-all data-[state=active]:bg-brand data-[state=active]:text-cream hover:text-cream sm:px-5"
                >
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((c) => (
              <TabsContent
                key={c.key}
                value={c.key}
                className="mt-8 rounded-3xl border border-cream/10 bg-ink-soft/70 p-6 sm:p-9"
              >
                <ul className="grid gap-x-10 md:grid-cols-2">
                  {MENU[c.key].map((item) => (
                    <MenuRow key={item.name} item={item} />
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <Reveal className="mt-8">
          <p className="mx-auto flex max-w-2xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-cream/40 sm:text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Harga dalam Rupiah dan dapat berubah sewaktu-waktu. Update menu
            &amp; promo terbaru selalu tayang di Instagram{" "}
            <a
              href="https://instagram.com/scndhomecoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-400 underline-offset-2 hover:underline"
            >
              @scndhomecoffee
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
