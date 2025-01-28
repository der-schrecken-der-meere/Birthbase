const get_relative_time_string = (from_timestamp: number, to_timestamp: number) => {
    const n_seconds = Math.floor((to_timestamp - from_timestamp) / 1000);

    const units: {unit: Intl.RelativeTimeFormatUnit, seconds: number}[] = [
        { unit: 'second', seconds: 1 },
        { unit: 'minute', seconds: 60 },
        { unit: 'hour', seconds: 60 },
        { unit: 'day', seconds: 24 },
        { unit: 'month', seconds: 30 },
        { unit: 'year', seconds: 12 }
    ];

    let time = n_seconds;
    let unit = units[0].unit;

    for (const { unit: u, seconds } of units) {
        if (Math.abs(time) < seconds) break;
        time = Math.round(time / seconds);
        unit = u;
        
    }

    return {
        time: Math.floor(time),
        unit,
    };
};

export { get_relative_time_string };