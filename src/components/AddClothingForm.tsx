"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ClothingItem } from "@/lib/mock-items";

const emptyFormData = {
  name: "",
  category: "",
  clothingType: "",
  color: "",
  season: "",
  style: "",
  occasion: "",
  material: "",
  favorite: false,
};

const textFields: { name: keyof typeof emptyFormData; label: string }[] = [
  { name: "name", label: "Name" },
  { name: "category", label: "Category" },
  { name: "clothingType", label: "Clothing Type" },
  { name: "color", label: "Color" },
  { name: "season", label: "Season" },
  { name: "style", label: "Style" },
  { name: "occasion", label: "Occasion" },
  { name: "material", label: "Material" },
];

export function AddClothingForm({
  onAdd,
}: {
  onAdd: (item: ClothingItem) => void;
}) {
  const [formData, setFormData] = useState(emptyFormData);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd({ id: crypto.randomUUID(), ...formData });
    setFormData(emptyFormData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {textFields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            {field.label}
            <input
              type="text"
              name={field.name}
              value={formData[field.name] as string}
              onChange={handleChange}
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-normal text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        <input
          type="checkbox"
          name="favorite"
          checked={formData.favorite}
          onChange={handleChange}
          className="h-4 w-4"
        />
        Favorite
      </label>

      <button
        type="submit"
        className="self-start rounded-xl bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Save item
      </button>
    </form>
  );
}
