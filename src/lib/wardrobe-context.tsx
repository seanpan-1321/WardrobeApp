"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { ClothingItem } from "@/lib/mock-items";
import type { Outfit } from "@/lib/outfits";
import { createClient } from "@/lib/supabase/client";

type WardrobeContextValue = {
  user: User | null;
  items: ClothingItem[];
  outfits: Outfit[];
  loading: boolean;
  saveItem: (item: ClothingItem) => void;
  deleteItem: (id: string) => void;
  saveOutfit: (outfit: Outfit) => void;
  deleteOutfit: (id: string) => void;
  signOut: () => Promise<void>;
};

const WardrobeContext = createContext<WardrobeContextValue | null>(null);

function toClothingItem(row: Record<string, unknown>): ClothingItem {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    clothingType: row.clothing_type as string,
    color: row.color as string,
    season: row.season as string,
    style: row.style as string,
    occasion: row.occasion as string,
    material: row.material as string,
    favorite: row.favorite as boolean,
    photoUrl: (row.photo_url as string | null) ?? undefined,
  };
}

function toItemRow(item: ClothingItem, userId: string) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    clothing_type: item.clothingType,
    color: item.color,
    season: item.season,
    style: item.style,
    occasion: item.occasion,
    material: item.material,
    favorite: item.favorite,
    user_id: userId,
    // photoUrl is an ephemeral blob URL; skip until image storage is added
  };
}

function toOutfit(row: Record<string, unknown>): Outfit {
  return {
    id: row.id as string,
    name: row.name as string,
    itemIds: (row.item_ids as string[]) ?? [],
  };
}

function toOutfitRow(outfit: Outfit, userId: string) {
  return {
    id: outfit.id,
    name: outfit.name,
    item_ids: outfit.itemIds,
    user_id: userId,
  };
}

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  // Track auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const userId = user?.id ?? null;

  // Load wardrobe data whenever the logged-in user changes
  useEffect(() => {
    async function sync() {
      if (!userId) {
        setItems([]);
        setOutfits([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const [
        { data: itemRows, error: itemsError },
        { data: outfitRows, error: outfitsError },
      ] = await Promise.all([
        supabase.from("clothing_items").select("*").order("created_at"),
        supabase.from("outfits").select("*").order("created_at"),
      ]);
      if (itemsError) console.error("Failed to load items:", itemsError);
      if (outfitsError) console.error("Failed to load outfits:", outfitsError);
      setItems((itemRows ?? []).map(toClothingItem));
      setOutfits((outfitRows ?? []).map(toOutfit));
      setLoading(false);
    }

    sync();
  }, [supabase, userId]);

  function saveItem(item: ClothingItem) {
    if (!user) return;
    setItems((prev) =>
      prev.some((e) => e.id === item.id)
        ? prev.map((e) => (e.id === item.id ? item : e))
        : [...prev, item],
    );
    supabase
      .from("clothing_items")
      .upsert(toItemRow(item, user.id))
      .then(({ error }) => {
        if (error) console.error("Failed to save item:", error);
      });
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    supabase
      .from("clothing_items")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Failed to delete item:", error);
      });
  }

  function saveOutfit(outfit: Outfit) {
    if (!user) return;
    setOutfits((prev) =>
      prev.some((e) => e.id === outfit.id)
        ? prev.map((e) => (e.id === outfit.id ? outfit : e))
        : [...prev, outfit],
    );
    supabase
      .from("outfits")
      .upsert(toOutfitRow(outfit, user.id))
      .then(({ error }) => {
        if (error) console.error("Failed to save outfit:", error);
      });
  }

  function deleteOutfit(id: string) {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
    supabase
      .from("outfits")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Failed to delete outfit:", error);
      });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <WardrobeContext.Provider
      value={{ user, items, outfits, loading, saveItem, deleteItem, saveOutfit, deleteOutfit, signOut }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error("useWardrobe must be used within a WardrobeProvider");
  }
  return context;
}
