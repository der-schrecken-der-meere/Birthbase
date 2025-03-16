import { getMonth } from "date-fns";
import { calc_days_until_next_birthday } from "./calculations.ts";
import { date_to_iso_with_tz } from "../date/timezone.ts";
import { MidnightTimestamp } from "@/lib/types/date.ts";
import { calculate_days_until_next_birthday } from "../birthday.ts";
import { midnight_utc } from "../date.ts";

/**
 * Groups birthdays by month
 */
const birthdaysToGroups = <T>(data: T[], dateAccess: (date: T) => MidnightTimestamp, locale: Intl.LocalesArgument, currentMonthText: string) => {

    const currentDate = new Date(midnight_utc(+new Date()));
    const monthFormat = new Intl.DateTimeFormat(locale, { month: "long" });

    return data.reduce((acc, cur) => {
        const date = dateAccess(cur);
        const monthName = 
            (
                getMonth(new Date(date)) === getMonth(currentDate) && 
                calculate_days_until_next_birthday(date) < 32
            ) ? currentMonthText : monthFormat.format(date);

        if (acc.length === 0) {
            acc.push({
                month: monthName,
                birthdays: [cur],
            });
            return acc;
        }
        if (acc[acc.length - 1].month === monthName) {
            acc[acc.length - 1].birthdays.push(cur);
            return acc;
        }
        acc.push({
            month: monthName,
            birthdays: [cur],
        })
        return acc;
    }, [] as {
        month: string,
        birthdays: T[]
    }[]);
};

export { birthdaysToGroups };
