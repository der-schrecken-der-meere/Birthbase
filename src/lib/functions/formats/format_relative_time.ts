import { relativeTime } from "../date/relative_time";

const formatRelativeTime = (
    locale: Intl.LocalesArgument,
    fromTimestamp: number,
    toTimestamp: number
) => {
    const { value, unit } = relativeTime(fromTimestamp, toTimestamp);
    return new Intl.RelativeTimeFormat(
        locale,
        {
            numeric: "always",
            style: "short"
        }
    ).format(value, unit);
};

export { formatRelativeTime };