import Image from "next/image";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Memuat halaman Second Home Coffee"
      className="grid min-h-screen place-items-center bg-cream"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-brand/15"
          />
          <Image
            src="/images/logo.png"
            alt=""
            width={442}
            height={512}
            className="relative h-20 w-auto animate-pulse"
            priority
          />
        </div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ink/40">
          Menyedot kopi dulu...
        </p>
      </div>
    </main>
  );
}
