import type { ClothingItem } from "@/lib/mock-items";
import { ClothingCard } from "@/components/ClothingCard";

export function WardrobeGrid({ items }: { items: ClothingItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <ClothingCard key={item.id} item={item} />
      ))}
    </div>
  );
}
