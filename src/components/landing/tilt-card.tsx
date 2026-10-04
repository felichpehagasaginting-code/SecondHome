"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  max?: number; // derajat kemiringan maksimum
};

/**
 * Kartu tilt-3D yang ngikutin pointer (desktop saja).
 * - gsap.quickTo: tanpa re-render React, interpolasi halus di rAF GSAP
 * - skip di perangkat sentuh & reduced-motion
 */
export function TiltCard({ children, className, max = 9 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
    };
    const onEnter = () =>
      gsap.to(el, { scale: 1.02, duration: 0.4, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.5)",
      });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [max]);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
