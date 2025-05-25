import { BirthdayCache, ComputedAppBirthday } from "../../types/query";
import { createSortedBirthdays } from "../../lib/instances/create/sorted_birthdays";

const createBirthdayCache = (birthdays?: (ComputedAppBirthday)[]): BirthdayCache => ({
    birthdays: createSortedBirthdays(birthdays),
});

export { createBirthdayCache };