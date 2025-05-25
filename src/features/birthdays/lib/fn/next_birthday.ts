// External features
import type { MidnightTimestamp } from "@/lib/types/date";
import { midnight_utc } from "@/lib/functions/date";

/**
 * Calculate the difference between today and the next birthday in days
 * 
 * If the birthday was already this year, the timestamp will be adjusted to the next year
 * 
 * @param timestamp Timestamp of the birthday in this year
 * @returns The difference in days
 */
const days_until_next_birthday = (timestamp: MidnightTimestamp) => {
    const today = midnight_utc(Date.now());
    let difference = timestamp - today;
    if (difference < 0) {
        const birthday = new Date(timestamp);
        const date_today = new Date(today);
        birthday.setUTCFullYear(date_today.getUTCFullYear() + 1);
        difference = +birthday - +date_today;
    }
    return Math.floor(difference / (1000 * 60 * 60 * 24));
};

export { days_until_next_birthday };