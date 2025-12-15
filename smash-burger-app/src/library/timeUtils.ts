/**
 * Generates an array of pickup time slots based on business rules:
 * 1. Prep time: 1 hour ahead of now.
 * 2. Opening: 12:00 PM (Noon).
 * 3. Closing: 9:00 PM (21:00).
 * 4. Cutoff: Orders placed within 2 hours of close (>= 7:00 PM) move to Tomorrow at Noon.
 */
export function generatePickupTime(): string[] {
    const times: string[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    // Work with a copy of the date to calculate the starting slot
    let startPointer = new Date(now);
    
    // --- RULE: Late Night / Cutoff Logic ---
    // Closing is 9 PM (21:00). 2 hours before is 7 PM (19:00).
    // If it is 7 PM or later, move to Tomorrow Noon.
    if (currentHour >= 19) {
        startPointer.setDate(startPointer.getDate() + 1); // Move to tomorrow
        startPointer.setHours(12, 0, 0, 0);               // Set to 12:00 PM
    } else {
        // --- RULE: Standard Prep Time ---
        // 1 Hour ahead of current time
        startPointer.setHours(startPointer.getHours() + 1);

        // Round up to the next 15-minute interval
        // e.g., if it's 1:05 -> 1:15
        const remainder = 15 - (startPointer.getMinutes() % 15);
        startPointer.setMinutes(startPointer.getMinutes() + remainder);
        startPointer.setSeconds(0);

        // --- RULE: Opening Time ---
        // Store opens at 12:00 PM. 
        // If our calculated time (Now + 1hr) is still before noon, force it to 12:00 PM.
        if (startPointer.getHours() < 12) {
            startPointer.setHours(12, 0, 0, 0);
        }
    }

    // Generate 6 slots (Giving the user about 1.5 hours of options)
    for (let i = 0; i < 6; i++) {
        // Determine if this specific slot falls on "Tomorrow" relative to right now
        const isTomorrow = startPointer.getDate() !== now.getDate();
        
        const timeString = startPointer.toLocaleTimeString([], { 
            hour: 'numeric', 
            minute: '2-digit' 
        });

        // Add helpful label if it's tomorrow
        if (isTomorrow) {
            times.push(`Tomorrow, ${timeString}`);
        } else {
            times.push(timeString);
        }

        // Increment by 15 minutes for the next loop
        startPointer.setMinutes(startPointer.getMinutes() + 15);
    }

    return times;
}