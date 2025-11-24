import { MenuItem } from "./types";
export const menuItems: MenuItem[] = [
    {id:'1', name: 'The Randy', description: 'Description of the randy burger',price:10.69,category:'burger'},
    {id:'2', name: 'Fries', description: 'Description of the side of fries',price:2.69,category:'side'}
];

export function getMenuCategories():string[]{
    const categories = new Set(MenuItem.map(item => item.category));
    return Array.from(categories);
}

export function getItemsByCategory(categor: string): MenuItem[]{
    return menuItems.filter(item => item.category === category);
}