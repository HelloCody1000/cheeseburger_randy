// src/library/menu.ts
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "The Randy",
    description: "Description of the Randy burger",
    price: 10.69,
    category: "burger",
  },
  {
    id: "2",
    name: "Fries",
    description: "Description of the side of fries",
    price: 2.69,
    category: "side",
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
