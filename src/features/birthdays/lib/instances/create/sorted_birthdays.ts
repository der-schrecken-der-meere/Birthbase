// External features
import type { ComputedAppBirthday } from "@/features/birthdays/types/query";
import { SortedArray } from "@/lib/classes/SortedArray";

const createSortedBirthdays = (birthdays: (ComputedAppBirthday)[] = []) => {
    const sorted = new SortedArray<ComputedAppBirthday>((arrayItem, newItem) => {
        const r = arrayItem.until - newItem.until;
        if (r === 0) return newItem.age - arrayItem.age;
        return r;
    });
    if (birthdays.length > 0) {
        sorted.add(...birthdays);
    }
    return sorted;
};

export { createSortedBirthdays };