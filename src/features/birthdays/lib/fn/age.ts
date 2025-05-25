// External features
import type { MidnightTimestamp } from "@/lib/types/date";

/**
 * Calculates the age of a given timestamp
 * 
 * @param timestamp 
 * @returns 
 */
const calculateAge = (timestamp: MidnightTimestamp): number => {
    const today = new Date();
    const birthday = new Date(timestamp);

    let age = today.getUTCFullYear() - birthday.getUTCFullYear();

    // If the birthday is this year, but is in the future
    if (+today < +birthday) {
        age--;
    }

    return age;
};

export { calculateAge };