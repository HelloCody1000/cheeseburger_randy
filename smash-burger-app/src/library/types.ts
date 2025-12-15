export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'appetizer' | 'burger' | 'side' | 'drink' ;
    availableQty: number;
}

export interface OrderItem {
    itemId: string;
    quantity: number;
}

export interface PickupTime {
    name: string;
    phone: string;
    email: string;
    orderedTime: number;
    pickUpTime: number;
}

export interface UserInfo {
    name: string;
    email: string;
    phone: string;
}