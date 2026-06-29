import type { ClothingItem } from "@/lib/mock-items";

function HangerIcon() {
  return (
    <svg
      width="28" height="26" viewBox="0 0 28 26"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      className="text-zinc-300 dark:text-zinc-600"
    >
      {/* Hook */}
      <path d="M14 2 C17 2 19 5 18 8 C17 10 15 10 14 10" />
      {/* Left arm */}
      <line x1="14" y1="10" x2="1" y2="24" />
      {/* Right arm */}
      <line x1="14" y1="10" x2="27" y2="24" />
      {/* Bottom bar */}
      <line x1="1" y1="24" x2="27" y2="24" />
    </svg>
  );
}

function TshirtIcon() {
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      className="text-zinc-300 dark:text-zinc-600"
    >
      <path d="M8 4 L2 10 L6 12 L6 24 L22 24 L22 12 L26 10 L20 4 C18 6 16 7 14 7 C12 7 10 6 8 4 Z" />
    </svg>
  );
}

export function WardrobeRail({ items }: { items: ClothingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Your Wardrobe
      </h2>

      <div className="relative">
        {/* Rail line — sits at the hook hang-point of HangerIcon (top-[8px]) */}
        <div className="pointer-events-none absolute inset-x-0 top-[8px] h-[2px] rounded-full bg-warm-border" />

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-4 px-1 pt-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex w-[80px] flex-col items-center"
                title={item.name}
              >
                <HangerIcon />

                {item.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface-hover">
                    <TshirtIcon />
                  </div>
                )}

                <p className="mt-1 w-full truncate text-center text-[11px] text-zinc-500 dark:text-zinc-400">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
