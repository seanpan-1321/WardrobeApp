"use client";

import { useState } from "react";
import Link from "next/link";
import { useWardrobe } from "@/lib/wardrobe-context";
import type { Outfit } from "@/lib/outfits";
import { OutfitCard } from "@/components/OutfitCard";
import { CreateOutfitForm } from "@/components/CreateOutfitForm";
import { Modal } from "@/components/Modal";
import { WardrobeRail } from "@/components/WardrobeRail";

export default function Home() {
  const { items, outfits, loading, saveOutfit, deleteOutfit } = useWardrobe();
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function matchesItemFields(itemId: string, query: string) {
    const item = items.find((existing) => existing.id === itemId);
    if (!item) return false;
    return [
      item.name,
      item.category,
      item.clothingType,
      item.color,
      item.season,
      item.style,
      item.occasion,
      item.material,
    ].some((field) => field.toLowerCase().includes(query));
  }

  const filteredOutfits = outfits.filter((outfit) => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return true;
    if (outfit.name.toLowerCase().includes(query)) return true;
    return outfit.itemIds.some((itemId) => matchesItemFields(itemId, query));
  });

  function handleSaveOutfit(outfit: Outfit) {
    saveOutfit(outfit);
    setEditingOutfit(null);
  }

  function handleDeleteOutfit(id: string) {
    if (!window.confirm("Delete this outfit?")) return;
    deleteOutfit(id);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-page-bg px-6 py-16 sm:px-10">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            My Outfits
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your saved outfits, built from items in your wardrobe.
          </p>
        </header>

        <WardrobeRail items={items} />

        <Link
          href="/create-outfit"
          className="flex items-center justify-center rounded-xl border border-dashed border-warm-border bg-surface px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-surface-hover dark:text-zinc-200"
        >
          + Create outfit
        </Link>

        {editingOutfit && (
          <Modal onClose={() => setEditingOutfit(null)}>
            <CreateOutfitForm
              items={items}
              onCreate={handleSaveOutfit}
              initialOutfit={editingOutfit}
            />
          </Modal>
        )}

        <section className="flex flex-col gap-4">
          {outfits.length > 0 && (
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your outfits..."
              className="rounded-lg border border-warm-border bg-surface px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50"
            />
          )}

          {outfits.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No outfits yet — head to{" "}
              <Link href="/create-outfit" className="underline">
                Create Outfit
              </Link>{" "}
              to build one from your wardrobe.
            </p>
          ) : filteredOutfits.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No outfits match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOutfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  items={items}
                  onEdit={() => setEditingOutfit(outfit)}
                  onDelete={() => handleDeleteOutfit(outfit.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
