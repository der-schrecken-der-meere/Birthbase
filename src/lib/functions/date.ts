import { MidnightTimestamp } from "../types/date";

/**
 * Transforms a given timestamp into its might night timestamp
 * 
 * @param timestamp 
 * @returns {number} UTC timestamp set to YYYY-MM-DDT00:00:00.000Z
 */
const midnight_utc = (timestamp: number): MidnightTimestamp => {
    const midnight_utc_date = new Date(timestamp);
    midnight_utc_date.setUTCHours(0, 0, 0, 0);
    return +midnight_utc_date as MidnightTimestamp;
};

export {
    midnight_utc,
};