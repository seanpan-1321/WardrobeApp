"use client";

import { useState } from "react";
import { useWardrobe } from "@/lib/wardrobe-context";
import type { ClothingItem } from "@/lib/mock-items";
import { WardrobeGrid } from "@/components/WardrobeGrid";
import { AddClothingForm } from "@/components/AddClothingForm";
import { Modal } from "@/components/Modal";

export default function ClothesPage() {
  const { items, loading, saveItem, deleteItem } = useWardrobe();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  function matchesItemFields(item: ClothingItem, query: string) {
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

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = query === "" || matchesItemFields(item, query);
    return matchesCategory && matchesQuery;
  });

  function handleSaveItem(item: ClothingItem) {
    saveItem(item);
    setShowForm(false);
    setEditingItem(null);
  }

  function handleEdit(id: string) {
    const item = items.find((existing) => existing.id === id);
    if (!item) return;
    setEditingItem(item);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this item from your wardrobe?")) return;
    deleteItem(id);
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
            My Clothes
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload your clothes and tag them so you can use them in outfits.
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center rounded-xl border border-dashed border-warm-border bg-surface px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-surface-hover dark:text-zinc-200"
        >
          + Add clothing item
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

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your wardrobe..."
              className="flex-1 rounded-lg border border-warm-border bg-surface px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50"
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-warm-border bg-surface px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No clothes yet — click <strong>+ Add clothing item</strong> above to get started.
            </p>
          ) : filteredItems.length === 0 ? (
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
