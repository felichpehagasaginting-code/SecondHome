"use client";

import { create } from "zustand";
import { BRAND } from "./data";

export type CartItem = { name: string; price: number; qty: number };

type CartState = {
  items: Record<string, CartItem>;
  add: (item: { name: string; price: number }) => void;
  dec: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: {},
  add: (item) =>
    set((state) => {
      const existing = state.items[item.name];
      return {
        items: {
          ...state.items,
          [item.name]: existing
            ? { ...existing, qty: existing.qty + 1 }
            : { ...item, qty: 1 },
        },
      };
    }),
  dec: (name) =>
    set((state) => {
      const existing = state.items[name];
      if (!existing) return state;
      if (existing.qty <= 1) {
        const next = { ...state.items };
        delete next[name];
        return { items: next };
      }
      return {
        items: { ...state.items, [name]: { ...existing, qty: existing.qty - 1 } },
      };
    }),
  remove: (name) =>
    set((state) => {
      const next = { ...state.items };
      delete next[name];
      return { items: next };
    }),
  clear: () => set({ items: {} }),
}));

export const cartList = (items: Record<string, CartItem>) =>
  Object.values(items);

export const cartTotal = (items: Record<string, CartItem>) =>
  Object.values(items).reduce((sum, i) => sum + i.price * i.qty, 0);

export const cartCount = (items: Record<string, CartItem>) =>
  Object.values(items).reduce((sum, i) => sum + i.qty, 0);

export const formatRp = (thousands: number) =>
  `Rp${(thousands * 1000).toLocaleString("id-ID")}`;

export function buildWaOrderLink(items: CartItem[]) {
  if (items.length === 0) {
    return `https://wa.me/${BRAND.phoneWa}`;
  }
  const lines = items.map(
    (i) => `• ${i.qty}x ${i.name} — ${formatRp(i.price * i.qty)}`
  );
  const message = [
    `Halo ${BRAND.name}! Saya mau pesan:`,
    "",
    ...lines,
    "",
    `Total: ${formatRp(cartTotal(Object.fromEntries(items.map((i) => [i.name, i]))))}`,
    "",
    "Nama pemesan: ",
    "Dine-in / Take Away: ",
    "Catatan: ",
  ].join("\n");
  return `https://wa.me/${BRAND.phoneWa}?text=${encodeURIComponent(message)}`;
}
