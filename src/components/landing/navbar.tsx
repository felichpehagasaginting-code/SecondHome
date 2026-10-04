"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu as MenuIcon, X, MessageCircle } from "lucide-react";
import { BRAND, waLink } from "./data";

const NAV_LINKS = [
  { href: "#tentang", label: "Tentang" },
  { href: "#menu", label: "Menu" },
  { href: "#promo", label: "Promo" },
  { href: "#galeri", label: "Galeri" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#lokasi", label: "Lokasi" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-cream/95 shadow-[0_1px_0_rgba(26,21,18,0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 md:h-20"
      >
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Logo Second Home Coffee"
            width={442}
            height={512}
            className="h-11 w-auto md:h-12"
          />
          <span className="leading-tight">
            <span className="block font-display text-base tracking-wide text-ink">
              SECOND HOME
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              Coffee · Bekasi
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold text-ink/80 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-cream shadow-[0_4px_14px_rgba(200,16,46,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pesan Sekarang
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-lg text-ink transition-colors hover:bg-ink/5 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-ink/8 bg-cream/100 px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-ink/85 transition-colors hover:bg-ink/5 hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-cream"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pesan via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
