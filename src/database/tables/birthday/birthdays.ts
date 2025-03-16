import { CoreRecord } from "@/database/db_types";
import { create_birthday } from "@/lib/functions/birthday";
import { MidnightTimestamp } from "@/lib/types/date";

type BirthdayCore = {
    name: {
        first: string,
        last: string,
    },
    timestamp: MidnightTimestamp,
};

type Birthday = CoreRecord & BirthdayCore;

const getDefaultBirthday = (): Birthday => create_birthday({
    id: -1,
    timestamp: Date.now(),
});

export type { Birthday, BirthdayCore };
export { getDefaultBirthday };