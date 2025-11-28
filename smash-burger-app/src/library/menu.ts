// src/library/menu.ts
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "CheeseBurger",
    description: "Description of the Randy burger",
    price: 8.69,
    category: "burger",
  },{
    id: "2",
    name: "The Randy",
    description: "Description of the Randy burger",
    price: 10.69,
    category: "burger",
  },{
    id: "3",
    name: "J.B.C",
    description: "Description of the Randy burger",
    price: 10.69,
    category: "burger",
  },
  {
    id: "4",
    name: "Fries",
    description: "Description of the side of fries",
    price: 3.69,
    category: "side",
  },
  {
    id: "5",
    name: "Rings",
    description: "Description of the side of fries",
    price: 6.69,
    category: "side",
  },{
    id: "6",
    name: "Frings",
    description: "Description of the side of fries",
    price: 5.69,
    category: "side",
  },
  {
    id: "7",
    name: "T.G.I Fries",
    description: "Description of the side of fries",
    price: 9.69,
    category: "side",
  },
  {
    id: "8",
    name: "Fountain Drink",
    description: "Description of the side of drinks",
    price: 2.69,
    category: "drink",
  },
];

// Get unique categories from menuItems
export function getMenuCategories(): string[] {
  const categories = new Set<string>();

  for (const item of menuItems) {
    categories.add(item.category);
  }

  return Array.from(categories);
}

// Get items for a specific category
export function getItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}
