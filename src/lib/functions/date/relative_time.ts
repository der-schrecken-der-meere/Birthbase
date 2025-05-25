/**
 * Returns the smallest relative time unit
 * 
 * @param fromTimestamp Timestamp 
 * @param toTimestamp Timestamp
 * @returns 
 */
const relativeTime = (fromTimestamp: number, toTimestamp: number) => {
    const units: {unit: Intl.RelativeTimeFormatUnit, seconds: number}[] = [
        { unit: 'second', seconds: 1 },
        { unit: 'minute', seconds: 60 },
        { unit: 'hour', seconds: 60 },
        { unit: 'day', seconds: 24 },
        { unit: 'month', seconds: 30 },
        { unit: 'year', seconds: 12 },
    ];

    let value = Math.floor((toTimestamp - fromTimestamp) / 1000);
    let unit = units[0].unit;

    for (const { unit: u, seconds } of units) {
        if (Math.abs(value) < seconds) break;
        value = Math.round(value / seconds);
        unit = u;
    }

    return {
        value: Math.floor(value),
        unit,
    };
};

export { relativeTime };