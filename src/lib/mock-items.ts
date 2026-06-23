export type ClothingItem = {
  id: string;
  name: string;
  category: string;
  clothingType: string;
  color: string;
  season: string;
  style: string;
  occasion: string;
  material: string;
  favorite: boolean;
  photoUrl?: string;
};

export const mockItems: ClothingItem[] = [
  {
    id: "1",
    name: "Black Jacket",
    category: "Outerwear",
    clothingType: "Jacket",
    color: "Black",
    season: "Winter",
    style: "Casual",
    occasion: "Everyday",
    material: "Leather",
    favorite: true,
  },
  {
    id: "2",
    name: "White T-Shirt",
    category: "Top",
    clothingType: "T-Shirt",
    color: "White",
    season: "Summer",
    style: "Casual",
    occasion: "Everyday",
    material: "Cotton",
    favorite: false,
  },
  {
    id: "3",
    name: "Blue Jeans",
    category: "Bottom",
    clothingType: "Jeans",
    color: "Blue",
    season: "All Season",
    style: "Casual",
    occasion: "Everyday",
    material: "Denim",
    favorite: true,
  },
  {
    id: "4",
    name: "Sneakers",
    category: "Footwear",
    clothingType: "Sneakers",
    color: "White",
    season: "All Season",
    style: "Sporty",
    occasion: "Athletic",
    material: "Mesh",
    favorite: false,
  },
];
