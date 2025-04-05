import type { MidnightTimestamp } from "@/lib/types/date.ts";

import { getMonth } from "date-fns";
import { calculate_days_until_next_birthday } from "../birthday.ts";
import { midnight_utc } from "../date.ts";

/**
 * Groups birthdays by month
 * @param data - Sorted array of birthdays by their timestamps
 */
const birthdaysToGroups = <T>(data: T[], dateAccess: (date: T) => MidnightTimestamp, locale: Intl.LocalesArgument, currentMonthText: string) => {

    const curDateMidnight = new Date(midnight_utc(+new Date()));
    const monthFormat = new Intl.DateTimeFormat(locale, { month: "long" });

    return data.reduce((acc, cur) => {
        // Get midnight timestamp of the comparing birthday
        const date = dateAccess(cur);

        const group_title = (
            // If the birthday is in the same month of the same year as the current date
            getMonth(new Date(date)) === getMonth(curDateMidnight) && 
            calculate_days_until_next_birthday(date) < 32
        )
            // Translation of "current month"
            ? currentMonthText
            // Month name
            : monthFormat.format(date);

        // If only one birthday is in the list return the birthday as the list
        if (acc.length === 0) {
            acc.push({
                month: group_title,
                birthdays: [cur],
            });
            return acc;
        }

        // If the birthday is in the last month group in the list add it to the month group
        if (acc[acc.length - 1].month === group_title) {
            acc[acc.length - 1].birthdays.push(cur);
            return acc;
        }

        // Create a new month group and add the birthday to it
        acc.push({
            month: group_title,
            birthdays: [cur],
        })
        return acc;
    }, [] as {
        month: string,
        birthdays: T[]
    }[]);
};

export { birthdaysToGroups };
