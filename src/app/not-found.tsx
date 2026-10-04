import Link from "next/link";
import Image from "next/image";
import { Home, MessageCircle } from "lucide-react";
import { waLink } from "@/components/landing/data";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="Logo Second Home Coffee"
          width={442}
          height={512}
          className="h-24 w-auto"
          priority
        />
        <p className="mt-8 font-display text-6xl uppercase leading-none text-brand">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl uppercase leading-tight text-cream sm:text-3xl">
          Kopinya ketumpahan, halamannya nggak ketemu.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/60">
          Tapi tenang — yang penting kopinya masih ada. Balik ke beranda buat
          lihat menu, atau langsung tanya-tanya ke kami via WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream shadow-[0_6px_20px_rgba(200,16,46,0.4)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <Home className="h-4 w-4" aria-hidden />
            Balik ke Beranda
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-cream/20 px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:border-cream/50"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Chat Kami
          </a>
        </div>
      </div>
    </main>
  );
}
