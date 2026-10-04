"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export type SplashPhase = {
  active: boolean;
  energy: number; // 0..1 — intensitas lemparan tetes
};

type Droplet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
};

const COLORS = ["#f6f1e7", "#c8102e", "#9e0b23", "#6d0718", "#e9e0cf"];

/**
 * Partikel tetes kopi untuk momen splash.
 * - canvas 2D ringan, DPR dibatasi 1.5 biar fill-rate aman di HP kentang
 * - jumlah partikel adaptif (luas layar + deviceMemory + hardwareConcurrency)
 * - rAF otomatis mati saat fase splash selesai & partikel habis (hemat baterai)
 */
export function SplashCanvas({
  phaseRef,
  apiRef,
}: {
  phaseRef: MutableRefObject<SplashPhase>;
  apiRef: MutableRefObject<{ wake: () => void } | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const droplets: Droplet[] = [];

    const nav = navigator as Navigator & { deviceMemory?: number };
    const mem = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    let cap = Math.round(Math.min(150, (window.innerWidth * window.innerHeight) / 9000));
    if (mem <= 4) cap = Math.round(cap * 0.55);
    if (cores <= 4) cap = Math.round(cap * 0.75);
    cap = Math.max(30, cap);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (n: number) => {
      for (let i = 0; i < n && droplets.length < cap; i++) {
        droplets.push({
          x: Math.random() * W,
          y: H * (0.72 + Math.random() * 0.32),
          vx: (Math.random() - 0.5) * 5.5,
          vy: -(6 + Math.random() * 9) * (0.5 + phaseRef.current.energy),
          r: 1.5 + Math.random() * 4.5,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 0,
          maxLife: 60 + Math.random() * 50,
        });
      }
    };

    const tick = () => {
      if (!running) return;
      const { active, energy } = phaseRef.current;
      if (active) spawn(Math.round(1 + energy * 7));

      ctx.clearRect(0, 0, W, H);
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.life++;
        d.vy += 0.35; // gravitasi
        d.vx *= 0.995;
        d.x += d.vx;
        d.y += d.vy;
        const t = d.life / d.maxLife;
        if (t >= 1 || d.y > H + 24) {
          droplets.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.4, d.r * (1 - t * 0.3)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!phaseRef.current.active && droplets.length === 0) {
        running = false; // fase selesai — matikan loop
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    apiRef.current = {
      wake: () => {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      },
    };

    const onVis = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
      running = false;
      apiRef.current = null;
    };
  }, [apiRef, phaseRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[35]"
    />
  );
}
