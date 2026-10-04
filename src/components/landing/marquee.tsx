import { MARQUEE_ITEMS } from "./data";

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative z-10 -rotate-1 overflow-hidden bg-brand py-3.5 shadow-lg" aria-hidden>
      <div className="marquee-paused flex w-max animate-marquee items-center">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-5 flex items-center gap-10 whitespace-nowrap font-display text-lg uppercase tracking-wider text-cream"
          >
            {item}
            <span className="text-cream/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
