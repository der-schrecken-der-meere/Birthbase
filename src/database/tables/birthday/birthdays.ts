import { date_to_iso_with_tz } from "@/lib/functions/date/timezone";
import type { ISODateFullTZ } from "@/lib/types/date";

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
    date: ISODateFullTZ,
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
    date: date_to_iso_with_tz(new Date()),
    marked: false,
    remember: [],
});

export type { Birthday, NoIDBirthday, PartialIDBirthday };
export { getDefaultBirthday };