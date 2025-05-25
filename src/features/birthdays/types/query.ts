// External features
import type { AppBirthday } from "@/database/birthalert/birthdays/types";
import type { SortedArray } from "@/lib/classes/SortedArray";
import type { DBRecord } from "@/lib/types/db";

type ComputedAppBirthday = {
    /** Birthday record */
    birthdayRecord: AppBirthday & DBRecord,
    /** Computed days until next birthday */
    until: number,
    /** Computed age */
    age: number,
};

type BirthdayCache = {
    birthdays: SortedArray<ComputedAppBirthday>,
};

export type {
    BirthdayCache,
    ComputedAppBirthday,
};