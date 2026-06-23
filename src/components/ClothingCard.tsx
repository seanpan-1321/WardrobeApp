import type { ClothingItem } from "@/lib/mock-items";

export function ClothingCard({ item }: { item: ClothingItem }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {item.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.photoUrl}
          alt={item.name}
          className="h-40 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          No photo
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-zinc-950 dark:text-zinc-50">
          {item.name}
        </p>
        {item.favorite && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-200">
            ★ Favorite
          </span>
        )}
      </div>
      <dl className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex justify-between gap-2">
          <dt>Category</dt>
          <dd>{item.category}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Type</dt>
          <dd>{item.clothingType}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Color</dt>
          <dd>{item.color}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Material</dt>
          <dd>{item.material}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Season</dt>
          <dd>{item.season}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Style</dt>
          <dd>{item.style}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Occasion</dt>
          <dd>{item.occasion}</dd>
        </div>
      </dl>
    </div>
  );
}
