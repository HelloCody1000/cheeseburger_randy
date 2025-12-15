/**
 * Generates an array of time strings (e.g., "5:00 PM") starting 15 mins from now
 * for the next 3 hours.
 */
 export function generatePickupTime(): string[] {
    const times: string[] = [];
    const now = new Date();

    // Start 15 minutes from now (Prep time)
    now.setMinutes(now.getMinutes() + 15);

    // Round up to next 15 minute interval
    const remainder = 15 - (now.getMinutes() % 15);
    now.setMinutes(now.getMinutes() + remainder);
    // Generate 8 slots (2 hours worth of slots)
    for (let curTime = 0; curTime < 8; curTime ++ ) {
        times.push(
            now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            );
            now.setMinutes(now.getMinutes() + 15);
    }
    return times;
 }