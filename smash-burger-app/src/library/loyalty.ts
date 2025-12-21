export const calculatePoints = (orderTototal: number): number => {
    return Math.floor(orderTototal) *10;
}