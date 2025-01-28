const format_number_to_month_lll = (locale: string, month_number: number) => {
    return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(1900, month_number));
};

const format_number_to_relative_time = (locale: string, time: number, unit: Intl.RelativeTimeFormatUnit) => {
    return new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" }).format(time, unit);
};

const get_local_timezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export {
    format_number_to_month_lll,
    format_number_to_relative_time,
    get_local_timezone,
};