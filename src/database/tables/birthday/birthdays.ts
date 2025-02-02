import { date_to_iso_with_tz } from "@/lib/functions/date/timezone";
import { format_date_to_iso_midnight } from "@/lib/intl/date";
import type { ISODateFullTZ, ISOMidnightFullTZ } from "@/lib/types/date";

type Remember = ISODateFullTZ[];

type Record = {
    id: number,
};

type PartialRecord = Partial<Record>;

type NoIDBirthday = {
    name: {
        first: string,
        last: string,
    },
    date: ISOMidnightFullTZ,
    marked: boolean,
    remember: Remember,
};

type PartialIDBirthday = PartialRecord & NoIDBirthday;

type Birthday = Record & NoIDBirthday;

const getDefaultBirthday = (): Birthday => ({
    id: -1,
    name: {
        first: "",
        last: "",
    },
    date: format_date_to_iso_midnight("de", "Europe/Berlin"),
    marked: false,
    remember: [],
});

export type { Birthday, NoIDBirthday, PartialIDBirthday };
export { getDefaultBirthday };