"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Hindari refresh "alon-alon" pas address bar HP muncul/hilang
ScrollTrigger.config({ ignoreMobileResize: true });

declare global {
  interface Window {
    /** Instance Lenis aktif — dipakai komponen (mis. lightbox) untuk stop/start scroll. */
    __lenis?: Lenis;
  }
}

/**
 * Smooth scroll (Lenis) + satu loop rAF bersama GSAP ticker.
 *
 * Optimasi "device kentang":
 * - `syncTouch: false` -> perangkat sentuh (HP) tetap pakai scroll native,
 *   jadi nol overhead JS per frame di mobile.
 * - `prefers-reduced-motion: reduce` -> Lenis & animasi dimatikan total.
 * - Satu rAF loop saja (gsap.ticker), tanpa duplicate requestAnimationFrame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 0.9,
      syncTouch: false,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);
    window.__lenis = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor navigation lewat Lenis biar mulus & tetap di bawah navbar.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.length < 2) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
