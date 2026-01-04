export const mapUserSelectionToToastPayload = (userItems: any[]) => {
  // 1. Placeholder GUID (We will replace this with real data later)
  const BURGER_GUID = "888-TOAST-BURGER-ID"; 
  
  // 2. Map the incoming items to the Toast structure
  const selections = userItems.map(item => {
    return {
      itemGroup: { guid: BURGER_GUID },
      quantity: 1,
      modifiers: [] // We'll add modifier logic later
    };
  });

  // 3. Return the full Toast Order Object
  // CRITICAL: Notice we create an object inside the 'checks' array
  return {
    restaurantGuid: process.env.RESTAURANT_GUID,
    checks: [
      {
        selections: selections
      }
    ]
  };
};