"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ClothingItem } from "@/lib/mock-items";
import { createClient } from "@/lib/supabase/client";

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
  initialItem,
}: {
  onAdd: (item: ClothingItem) => void;
  initialItem?: ClothingItem;
}) {
  const [formData, setFormData] = useState(
    initialItem
      ? {
          name: initialItem.name,
          category: initialItem.category,
          clothingType: initialItem.clothingType,
          color: initialItem.color,
          season: initialItem.season,
          style: initialItem.style,
          occasion: initialItem.occasion,
          material: initialItem.material,
          favorite: initialItem.favorite,
        }
      : emptyFormData,
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialItem?.photoUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl && !initialItem?.photoUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setUploadError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const itemId = initialItem?.id ?? crypto.randomUUID();
    let photoUrl = initialItem?.photoUrl;

    if (photoFile) {
      setUploading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const ext = photoFile.name.split(".").pop();
      const path = `${user!.id}/${itemId}.${ext}`;
      const { error } = await supabase.storage
        .from("clothing-photos")
        .upload(path, photoFile, { upsert: true });

      if (error) {
        setUploadError("Photo upload failed. Item saved without photo.");
        console.error("Upload error:", error);
      } else {
        const { data } = supabase.storage
          .from("clothing-photos")
          .getPublicUrl(path);
        photoUrl = data.publicUrl;
      }
      setUploading(false);
    }

    onAdd({ id: itemId, ...formData, photoUrl });

    if (!initialItem) {
      setFormData(emptyFormData);
      setPhotoFile(null);
      setPreviewUrl(null);
    }
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

      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="text-sm text-zinc-700 dark:text-zinc-200"
        />
      </label>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Selected clothing item preview"
          className="h-40 w-40 rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
        />
      )}

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

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="self-start rounded-xl bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {uploading ? "Uploading photo..." : initialItem ? "Save changes" : "Save item"}
      </button>
    </form>
  );
}
