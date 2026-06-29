"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { ClothingItem } from "@/lib/mock-items";
import type { Outfit } from "@/lib/outfits";
import { WardrobeGrid } from "@/components/WardrobeGrid";

export function CreateOutfitForm({
  items,
  onCreate,
  initialOutfit,
}: {
  items: ClothingItem[];
  onCreate: (outfit: Outfit) => void;
  initialOutfit?: Outfit;
}) {
  const [name, setName] = useState(initialOutfit?.name ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialOutfit?.itemIds ?? []),
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({
      id: initialOutfit?.id ?? crypto.randomUUID(),
      name,
      itemIds: [...selectedIds],
    });
    if (!initialOutfit) {
      setName("");
      setSelectedIds(new Set());
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto rounded-xl border border-warm-border bg-surface p-5"
    >
      <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        {initialOutfit ? `Edit "${initialOutfit.name}"` : "Create outfit"}
      </h2>

      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Outfit name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="rounded-lg border border-warm-border bg-surface px-3 py-2 text-sm font-normal text-zinc-950 dark:text-zinc-50"
        />
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Select items ({selectedIds.size} selected)
        </p>
        <WardrobeGrid
          items={items}
          selectable
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      </div>

      <button
        type="submit"
        disabled={selectedIds.size === 0}
        className="self-start rounded-xl bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {initialOutfit ? "Save changes" : "Save outfit"}
      </button>
    </form>
  );
}
