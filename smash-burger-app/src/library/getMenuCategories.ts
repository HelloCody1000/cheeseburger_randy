import { type MenuItem } from "./types";

/**
 * Extracts unique categories from a list of menu items.
 */
export function getMenuCategories(menuItems: MenuItem[]): string[] {
    const categories = new Set<string>();
    for (const item of menuItems) {
        // Change 'categories' to 'category' to match your interface
        categories.add(item.category); 
    }
    return Array.from(categories);
}