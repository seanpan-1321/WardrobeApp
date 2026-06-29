import type { ClothingItem } from "@/lib/mock-items";

export function ClothingCard({
  item,
  selectable = false,
  selected = false,
  onToggleSelect,
  onEdit,
  onDelete,
}: {
  item: ClothingItem;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      onClick={selectable ? onToggleSelect : undefined}
      className={`flex flex-col gap-2 rounded-xl border bg-surface p-4 shadow-sm ${
        selectable
          ? "cursor-pointer border-2 " +
            (selected
              ? "border-zinc-950 dark:border-zinc-50"
              : "border-warm-border")
          : "border border-warm-border"
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
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-surface-hover text-sm text-zinc-400 dark:text-zinc-500">
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
          {!selectable && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${item.name}`}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
            >
              Edit
            </button>
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
      <div className="flex flex-wrap gap-1.5">
        {[item.clothingType, item.color, item.season, item.style].map((tag, i) =>
          tag ? (
            <span
              key={i}
              className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
