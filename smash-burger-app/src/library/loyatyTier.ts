export const getLoyaltyTier = (totalPoints: number): 'Bronze' | 'Silver' | 'Gold' => {
    if (totalPoints > 1000) return 'Gold';
    if (totalPoints > 500) return 'Silver';
    return 'Bronze';
    //will use this for future project
}