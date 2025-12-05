import { MenuItem } from "./types";
/**
 * Returns a NEW array of menu items with the quantity of the specific ID decremented by 1.
 * This is a "pure function" - it does not modify the original array, it returns a new one.
 */
export function reserveOneItem(menu: MenuItem[], id: string): MenuItem[] {
    return menu.map((item)  =>
        item.id === id && item.avaibleQty > 0
        ? {...item, availableQty: item.availableQty - 1}
        : item
    );
}