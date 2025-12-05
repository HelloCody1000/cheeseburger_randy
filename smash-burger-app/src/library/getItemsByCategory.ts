import { MenuItem } from "./types";
import { menuItems } from "./menu";
/**
 * Returns all menu items that belong to a specific category.
 */
export function getItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}