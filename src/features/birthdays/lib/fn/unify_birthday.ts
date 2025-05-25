// External features
import type { AppBirthday } from "@/database/birthalert/birthdays/types";
import type { DBRecord } from "@/lib/types/db";

// Internal features
import type { ComputedAppBirthday } from "../../types/query";
import { days_until_next_birthday } from "./next_birthday";
import { calculateAge } from "./age";
import { midnight_utc } from "@/lib/functions/date";

const unify_birthday = (birthday: AppBirthday & DBRecord): ComputedAppBirthday => {
    const { timestamp, reminder, ...props } = birthday;

    const new_reminders = reminder.reduce<number[]>((acc, cur) => {
        if (!acc.includes(cur)) {
            acc.push(cur);
        }
        return acc;
    }, []).toSorted();

    const midnight_timestamp = midnight_utc(timestamp);

    const until = days_until_next_birthday(timestamp);
    const age = calculateAge(timestamp);

    return {
        birthdayRecord: {
            timestamp: midnight_timestamp,
            reminder: new_reminders,
            ...props
        },
        until,
        age,
    };
};

export { unify_birthday };