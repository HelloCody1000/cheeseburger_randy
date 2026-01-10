// lambda/create-order/test/menuMapper.test.ts
import { mapUserSelectionToToastPayload } from '../menuMapper.js';

describe('Menu Mapper Logic', () => {
  // Setup generic environment variables before running tests
  beforeAll(() => {
    process.env.RESTAURANT_GUID = 'TEST_RESTAURANT_GUID_123';
  });

  test('should convert a React frontend order into a Toast API payload', () => {
    // 1. ARRANGE: Define what your React Front End sends
    const mockUserItems = [
      {
        internalId: 1,
        name: 'Classic Smash',
        // In your real app, these might be IDs, but let's assume names for clarity now
        modifiers: ['Cheese', 'No Onions'] 
      }
    ];

    // 2. ACT: Run your function
    const result = mapUserSelectionToToastPayload(mockUserItems);

    // 3. ASSERT: Check if the output matches what Toast needs
    expect(result).toBeDefined();
    expect(result.restaurantGuid).toBe('TEST_RESTAURANT_GUID_123');
    
    // Check if the "checks" array was created
    expect(result.checks).toHaveLength(1);
    
    // Drill down to ensure the logic mapped the item correctly
    // (Note: You'll need to adjust these expected values based on your real GUID logic)
    expect(result.checks[0].selections[0].quantity).toBe(1);
  });

  test('should handle empty orders gracefully', () => {
    const result = mapUserSelectionToToastPayload([]);
    expect(result.checks[0].selections).toHaveLength(0);
  });
});