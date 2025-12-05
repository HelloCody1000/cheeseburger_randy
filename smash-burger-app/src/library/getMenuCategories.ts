import { MenuItem } from "./types";
/**
 * Extracts unique categories from a list of menu items.
 */
export function getMenuCategories(menuItems: MenuItem[]): string[] {
    const categories = new Set<string>();
    for (const item of menuItems) {
        categories.add(item.categories);
    }
    return Array.from(categories);
}