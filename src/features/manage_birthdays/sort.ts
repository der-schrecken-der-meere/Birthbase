import { calc_days_until_next_birthday } from "@/lib/functions/birthdays/calculations";
import type { Birthday } from "../../database/tables/birthday/birthdays";
import {
    add_sorted_array,
    upd_sorted_array,
    del_sorted_array
} from "../../lib/functions/array/sort";
import { date_to_iso_with_tz } from "@/lib/functions/date/timezone";

/**
 * Adds a new birhtday to a sorted array
 */
const add_sorted_birthdays = (sortedArray: Birthday[], birthday: Birthday) => {
    const str_cur_date = date_to_iso_with_tz(new Date());
    return add_sorted_array(sortedArray, birthday, (v) => {
        return calc_days_until_next_birthday(birthday.date, str_cur_date) <= calc_days_until_next_birthday(v.date, str_cur_date);
        // birthday.date <= v.date
    });
};

/**
 * Updates a birthday in a sorted array
 * 
 * Perhaps change the position of the updated birhtday in the sorted array
 */
const upd_sorted_birthdays = (sortedArray: Birthday[], newBirthday: Birthday) => {
    const oldBirthdayIndex = sortedArray.findIndex((oldBirthday) => oldBirthday.id === newBirthday.id);
    if (oldBirthdayIndex === -1) {
        return add_sorted_birthdays(sortedArray, newBirthday);
    }
    if (sortedArray[oldBirthdayIndex].date === newBirthday.date) {
        const cpySortedArray = [...sortedArray];
        cpySortedArray[oldBirthdayIndex] = newBirthday;
        return cpySortedArray;
    }
    return upd_sorted_array(sortedArray, oldBirthdayIndex, newBirthday, (v) => newBirthday.date <= v.date);
};

/**
 * Deletes a birthday in a sorted array
 */
const del_sorted_birthdays = (sortedArray: Birthday[], birthdayID: number) => {
    return del_sorted_array(sortedArray, (v) => v.id === birthdayID);
};

export {
    add_sorted_birthdays,
    upd_sorted_birthdays,
    del_sorted_birthdays
};