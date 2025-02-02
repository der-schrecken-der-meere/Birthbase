import { ISODateFull, ISODateFullTZ, ISOMidnightFullTZ, TimeZone } from "../types/date";

const format_number_to_month_lll = (locale: string, month_number: number) => {
    return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(1900, month_number));
};

const format_number_to_relative_time = (locale: string, time: number, unit: Intl.RelativeTimeFormatUnit) => {
    return new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" }).format(time, unit);
};

const get_local_timezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const get_timezone = (
    locale: Intl.LocalesArgument,
    timeZone: Intl.DateTimeFormatOptions["timeZone"],
    date: ISODateFull
): TimeZone => {
    const obj_parts = Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "longOffset" }).formatToParts(new Date(date));
    const timezone = obj_parts
        .find(part => part.type === "timeZoneName")
        ?.value
        .slice(-6);
    if (timezone?.length === 6) {
        return timezone as TimeZone;
    }
    return "+00:00";
};

const format_date_to_iso = (
    locale: Intl.LocalesArgument,
    timeZone: Intl.DateTimeFormatOptions["timeZone"],
    date: Date = new Date()
): ISODateFullTZ => {
    const iso_date = date.toISOString().slice(0, -1) as ISODateFull;
    const timezone = get_timezone(locale, timeZone, iso_date);
    return `${iso_date}${timezone}`;
};

const format_date_to_iso_midnight = (
    locale: Intl.LocalesArgument,
    timeZone: Intl.DateTimeFormatOptions["timeZone"],
    date: Date = new Date()
): ISOMidnightFullTZ => {
    const iso_str = format_date_to_iso(locale, timeZone, date);
    const date_str = iso_str.slice(0, 11);
    const timezone_str = iso_str.slice(-6);
    return `${date_str}00:00:00.000${timezone_str}` as ISOMidnightFullTZ;
};

const format_date_to_short_str = (
    locale: Intl.LocalesArgument,
    timeZone: string,
    date: Date,
) => {
    return Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeZone,
    }).format(date);
};

export {
    format_number_to_month_lll,
    format_number_to_relative_time,
    format_date_to_short_str,
    format_date_to_iso_midnight,
    format_date_to_iso,
    get_local_timezone,
    get_timezone,
};