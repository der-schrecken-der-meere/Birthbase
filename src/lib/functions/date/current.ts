/**
 * Returns the UTC midnight timestamp of the current date
 */
const utc_midnight_timestamp = (): number => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return +date;
};

export {
    utc_midnight_timestamp
};