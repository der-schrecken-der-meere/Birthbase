import { get_supported_tz } from "@/lib/functions/date/timezone";

const supportedTimeZones = get_supported_tz().map((timezone) => {
    let offset = Intl.DateTimeFormat("de", { timeZone: timezone, timeZoneName: "longOffset" }).format();
    if (offset[offset.length - 1] === "T") {
        offset = "+00:00";
    } else {
        offset = offset.slice(-6);
    }
    return {
        name: timezone,
        offset,
    };
});

export { supportedTimeZones };