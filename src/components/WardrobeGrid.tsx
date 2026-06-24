import type { ClothingItem } from "@/lib/mock-items";
import { ClothingCard } from "@/components/ClothingCard";

export function WardrobeGrid({
  items,
  selectable = false,
  selectedIds,
  onToggleSelect,
}: {
  items: ClothingItem[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          selectable={selectable}
          selected={selectedIds?.has(item.id) ?? false}
          onToggleSelect={
            onToggleSelect ? () => onToggleSelect(item.id) : undefined
          }
        />
      ))}
    </div>
  );
}
