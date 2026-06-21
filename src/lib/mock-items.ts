export type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  season: string;
  style: string;
};

export const mockItems: ClothingItem[] = [
  {
    id: "1",
    name: "Black Jacket",
    category: "Outerwear",
    color: "Black",
    season: "Winter",
    style: "Casual",
  },
  {
    id: "2",
    name: "White T-Shirt",
    category: "Top",
    color: "White",
    season: "Summer",
    style: "Casual",
  },
  {
    id: "3",
    name: "Blue Jeans",
    category: "Bottom",
    color: "Blue",
    season: "All Season",
    style: "Casual",
  },
  {
    id: "4",
    name: "Sneakers",
    category: "Footwear",
    color: "White",
    season: "All Season",
    style: "Sporty",
  },
];
