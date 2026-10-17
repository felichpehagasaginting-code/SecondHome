"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  QrCode,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart, cartList, cartTotal, cartCount, formatRp, buildWaOrderLink } from "./cart-store";
import { QrisModal } from "./qris-modal";

export function CartBar() {
  const [open, setOpen] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const dec = useCart((s) => s.dec);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const list = cartList(items);
  const count = cartCount(items);
  const total = cartTotal(items);

  if (count === 0) return null;

  return (
    <>
      {/* Bar keranjang */}
      <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-3 pb-3 sm:px-6 sm:pb-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-brand px-5 py-4 text-cream shadow-[0_10px_30px_rgba(200,16,46,0.45)] transition-all hover:bg-brand-dark"
          >
            <span className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-cream/15">
                <ShoppingBag className="h-5 w-5" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-cream px-1 font-display text-xs text-brand">
                  {count}
                </span>
              </span>
              <span className="text-left">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-cream/70">
                  Pesananmu
                </span>
                <span className="block font-display text-lg leading-none">
                  {formatRp(total)}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-cream px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand">
              Lihat Pesanan
            </span>
          </button>
        </div>
      </div>

      {/* Sheet keranjang */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[88vh] w-full max-w-lg rounded-t-3xl border-cream/15 bg-ink p-0 text-cream sm:max-w-lg"
        >
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-cream/10 px-6 py-4">
            <div>
              <SheetTitle className="font-display text-xl uppercase tracking-wide text-cream">
                Pesananmu
              </SheetTitle>
              <SheetDescription className="text-xs text-cream/50">
                {count} item siap dikirim ke barista
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup keranjang"
              className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-cream/70 transition-colors hover:bg-cream/20 hover:text-cream"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </SheetHeader>

          <div
            data-lenis-prevent
            className="nice-scroll max-h-[46vh] overflow-y-auto px-6 py-4"
          >
            <ul className="space-y-3">
              {list.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-2xl border border-cream/10 bg-ink-soft px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-cream">
                      {item.name}
                    </p>
                    <p className="text-xs text-cream/50">
                      {formatRp(item.price)} · subtotal{" "}
                      <span className="font-semibold text-cream/75">
                        {formatRp(item.price * item.qty)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-cream/10 p-1">
                    <button
                      type="button"
                      aria-label={`Kurangi ${item.name}`}
                      onClick={() => dec(item.name)}
                      className="grid h-6 w-6 place-items-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-dark"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <span className="min-w-6 text-center font-display text-sm">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label={`Tambah ${item.name}`}
                      onClick={() => add(item)}
                      className="grid h-6 w-6 place-items-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-dark"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Hapus ${item.name}`}
                    onClick={() => remove(item.name)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={clear}
              className="mx-auto mt-4 block text-xs font-semibold uppercase tracking-wide text-cream/40 transition-colors hover:text-red-400"
            >
              Kosongkan pesanan
            </button>
          </div>

          <div className="border-t border-cream/10 px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-cream/60">
                Total
              </span>
              <span className="font-display text-2xl text-brand">
                {formatRp(total)}
              </span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowQrisModal(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-[0_6px_20px_rgba(200,16,46,0.35)] transition-all hover:bg-brand-dark hover:-translate-y-0.5"
              >
                <QrCode className="h-4 w-4" aria-hidden />
                Bayar via QRIS ({formatRp(total)})
              </button>

              <a
                href={buildWaOrderLink(list)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cream/15 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wide text-cream/90 transition-all hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 text-[#25d366]" aria-hidden />
                Atau Pesan via WhatsApp
              </a>
            </div>
            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-cream/40">
              Pilih bayar langsung menggunakan <strong>QRIS Mayar</strong> atau pesan manual lewat WhatsApp.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal QRIS Interaktif */}
      <QrisModal
        isOpen={showQrisModal}
        onClose={() => setShowQrisModal(false)}
        amount={total}
        itemsSummary={list.map((i) => `${i.qty}x ${i.name}`)}
        onPaymentSuccess={() => {
          clear();
        }}
      />
    </>
  );
}
