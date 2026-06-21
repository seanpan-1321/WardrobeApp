import type { ClothingItem } from "@/lib/mock-items";
import { ClothingCard } from "@/components/ClothingCard";

export function WardrobeGrid({ items }: { items: ClothingItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ClothingCard key={item.id} item={item} />
      ))}
    </div>
  );
}
