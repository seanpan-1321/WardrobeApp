"use client";

import { useState } from "react";
import { mockItems } from "@/lib/mock-items";
import type { ClothingItem } from "@/lib/mock-items";
import { WardrobeGrid } from "@/components/WardrobeGrid";
import { AddClothingForm } from "@/components/AddClothingForm";
import { Modal } from "@/components/Modal";

export default function Home() {
  const [items, setItems] = useState<ClothingItem[]>(mockItems);
  const [showForm, setShowForm] = useState(false);

  function handleAdd(item: ClothingItem) {
    setItems((prev) => [...prev, item]);
    setShowForm(false);
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

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            + Add clothing item
          </button>

          {showForm && (
            <Modal onClose={() => setShowForm(false)}>
              <AddClothingForm onAdd={handleAdd} />
            </Modal>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Your wardrobe
          </h2>

          <WardrobeGrid items={items} />
        </section>
      </main>
    </div>
  );
}
