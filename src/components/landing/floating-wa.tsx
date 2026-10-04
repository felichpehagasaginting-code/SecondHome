"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "./data";
import { useCart, cartCount } from "./cart-store";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (count > 0) return null;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Second Home Coffee"
      className={`fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40" aria-hidden />
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
