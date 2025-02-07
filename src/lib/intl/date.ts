import { ISOMidnightFullTZ, TimeZone } from "../types/date";

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
    parts: Intl.DateTimeFormatPart[],
): TimeZone => {
    const timezone = parts
        .find(part => part.type === "timeZoneName")
        ?.value
        .slice(-6);
    if (timezone?.length === 6) {
        return timezone as TimeZone;
    }
    return "+00:00";
};

const find_part = (parts: Intl.DateTimeFormatPart[], type: keyof Intl.DateTimeFormatPartTypesRegistry) => {
    return parts.find(part => part.type === type)?.value;
};

const format_date_to_iso_midnight = (
    locale: Intl.LocalesArgument,
    timeZone: Intl.DateTimeFormatOptions["timeZone"],
    date: Date = new Date()
): ISOMidnightFullTZ => {
    Intl.DateTimeFormat("de", { month: "2-digit", })
    const obj_parts = Intl.DateTimeFormat(
        locale,
        {
            timeZone,
            timeZoneName: "longOffset",
            year: "numeric",
            day: "2-digit",
            month: "2-digit"
        }
    ).formatToParts(date);
    const date_str = `${find_part(obj_parts, "year")}-${find_part(obj_parts, "month")}-${find_part(obj_parts, "day")}`;
    const timezone_str = get_timezone(obj_parts);
    return `${date_str}T00:00:00.000${timezone_str}` as ISOMidnightFullTZ;
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
    get_local_timezone,
    get_timezone,
};