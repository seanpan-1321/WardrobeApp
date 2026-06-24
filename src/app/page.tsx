"use client";

import { useState } from "react";
import { mockItems } from "@/lib/mock-items";
import type { ClothingItem } from "@/lib/mock-items";
import { mockOutfits } from "@/lib/outfits";
import type { Outfit } from "@/lib/outfits";
import { WardrobeGrid } from "@/components/WardrobeGrid";
import { AddClothingForm } from "@/components/AddClothingForm";
import { CreateOutfitForm } from "@/components/CreateOutfitForm";
import { OutfitCard } from "@/components/OutfitCard";
import { Modal } from "@/components/Modal";

export default function Home() {
  const [items, setItems] = useState<ClothingItem[]>(mockItems);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [showForm, setShowForm] = useState(false);
  const [showOutfitForm, setShowOutfitForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      [
        item.name,
        item.category,
        item.clothingType,
        item.color,
        item.season,
        item.style,
        item.occasion,
        item.material,
      ].some((field) => field.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  function handleSaveItem(item: ClothingItem) {
    setItems((prev) =>
      prev.some((existing) => existing.id === item.id)
        ? prev.map((existing) => (existing.id === item.id ? item : existing))
        : [...prev, item],
    );
    setShowForm(false);
    setEditingItem(null);
  }

  function handleEdit(id: string) {
    const item = items.find((existing) => existing.id === id);
    if (!item) return;
    setEditingItem(item);
    setShowForm(true);
  }

  function handleSaveOutfit(outfit: Outfit) {
    setOutfits((prev) =>
      prev.some((existing) => existing.id === outfit.id)
        ? prev.map((existing) =>
            existing.id === outfit.id ? outfit : existing,
          )
        : [...prev, outfit],
    );
    setShowOutfitForm(false);
    setEditingOutfit(null);
  }

  function handleEditOutfit(id: string) {
    const outfit = outfits.find((existing) => existing.id === id);
    if (!outfit) return;
    setEditingOutfit(outfit);
    setShowOutfitForm(true);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this item from your wardrobe?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDeleteOutfit(id: string) {
    if (!window.confirm("Delete this outfit?")) return;
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black sm:px-10">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Wardrobe App
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload your clothes, tag them, and build outfits from what you
            already own.
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            + Add clothing item
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingOutfit(null);
              setShowOutfitForm(true);
            }}
            className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            + Create outfit
          </button>

          {showForm && (
            <Modal
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            >
              <AddClothingForm
                onAdd={handleSaveItem}
                initialItem={editingItem ?? undefined}
              />
            </Modal>
          )}

          {showOutfitForm && (
            <Modal
              onClose={() => {
                setShowOutfitForm(false);
                setEditingOutfit(null);
              }}
            >
              <CreateOutfitForm
                items={items}
                onCreate={handleSaveOutfit}
                initialOutfit={editingOutfit ?? undefined}
              />
            </Modal>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Your outfits
          </h2>

          {outfits.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No outfits yet — select items from your wardrobe to create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {outfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  items={items}
                  onEdit={() => handleEditOutfit(outfit.id)}
                  onDelete={() => handleDeleteOutfit(outfit.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Your wardrobe
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your wardrobe..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No items match your search.
            </p>
          ) : (
            <WardrobeGrid
              items={filteredItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
