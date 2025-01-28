import type { TimeZone } from "../../types/date.ts";
import type { ISODateFullTZ } from "@/lib/types/date";

const get_supported_tz = (): TimeZone[] => {
    return Intl.supportedValuesOf("timeZone");
};

const get_local_tz = (locale: string) => {
    return new Intl.DateTimeFormat(locale, { timeZoneName: "longOffset" }).format(new Date()).slice(-6);
};

const date_to_iso_with_tz = (date: Date): ISODateFullTZ => {
    const n_tz = date.getTimezoneOffset();
    const n_tz_hours = (() => {
        const hours = Math.floor(Math.abs(n_tz) / 60);
        return hours < 10 ? `0${hours}` : `${hours}`;
    })();
    const n_tz_minutes = (() => {
        const minutes = Math.abs(n_tz) % 60;
        return minutes < 10 ? `0${minutes}` : `${minutes}`;
    })();
    date.setMinutes(-n_tz + date.getMinutes());

    return `${date.toISOString().slice(0, -1)}${n_tz < 0 ? "+" : "-"}${n_tz_hours}:${n_tz_minutes}` as ISODateFullTZ;
};

const current_date_to_iso = () => {
    return date_to_iso_with_tz(new Date());
};

const format_number_to_month_lll = (locale: string, month_number: number) => {
    return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(1900, month_number));
};

const get_local_timezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export {
    format_number_to_month_lll,
    get_local_timezone,
    get_supported_tz,
    get_local_tz,
    date_to_iso_with_tz,
    current_date_to_iso,
};