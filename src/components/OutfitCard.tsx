import type { ClothingItem } from "@/lib/mock-items";
import type { Outfit } from "@/lib/outfits";

export function OutfitCard({
  outfit,
  items,
  onDelete,
}: {
  outfit: Outfit;
  items: ClothingItem[];
  onDelete?: () => void;
}) {
  const outfitItems = items.filter((item) => outfit.itemIds.includes(item.id));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-zinc-950 dark:text-zinc-50">
          {outfit.name}
        </p>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${outfit.name}`}
            className="text-xs font-medium text-zinc-400 transition-colors hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {outfitItems.map((item) =>
          item.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={item.photoUrl}
              alt={item.name}
              title={item.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div
              key={item.id}
              title={item.name}
              className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 text-center text-[10px] text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            >
              {item.name}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
