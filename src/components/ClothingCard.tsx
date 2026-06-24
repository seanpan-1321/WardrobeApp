import type { ClothingItem } from "@/lib/mock-items";

export function ClothingCard({
  item,
  selectable = false,
  selected = false,
  onToggleSelect,
  onDelete,
}: {
  item: ClothingItem;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      onClick={selectable ? onToggleSelect : undefined}
      className={`flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 ${
        selectable
          ? "cursor-pointer border-2 " +
            (selected
              ? "border-zinc-950 dark:border-zinc-50"
              : "border-zinc-200 dark:border-zinc-800")
          : "border border-zinc-200 dark:border-zinc-800"
      }`}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(event) => event.stopPropagation()}
          className="h-4 w-4 self-end"
        />
      )}
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
        <div className="flex items-center gap-2">
          {item.favorite && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-200">
              ★ Favorite
            </span>
          )}
          {!selectable && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${item.name}`}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
            >
              Delete
            </button>
          )}
        </div>
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
