"use client";

import { useRouter } from "next/navigation";
import { useWardrobe } from "@/lib/wardrobe-context";
import type { Outfit } from "@/lib/outfits";
import { CreateOutfitForm } from "@/components/CreateOutfitForm";

export default function CreateOutfitPage() {
  const { items, loading, saveOutfit } = useWardrobe();
  const router = useRouter();

  function handleCreate(outfit: Outfit) {
    saveOutfit(outfit);
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black sm:px-10">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create Outfit
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Pick items from your wardrobe to put together a new outfit.
          </p>
        </header>

        <CreateOutfitForm items={items} onCreate={handleCreate} />
      </main>
    </div>
  );
}
