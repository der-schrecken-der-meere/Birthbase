import type { Birthday } from "../../database/tables/birthday/birthdays";
import {
    add_sorted_array,
    upd_sorted_array,
    del_sorted_array
} from "../../lib/functions/array/sort";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";

/**
 * Adds a new birhtday to a sorted array
 */
const add_sorted_birthdays = (sortedArray: Birthday[], birthday: Birthday) => {
    return add_sorted_array(sortedArray, birthday, (v) => {
        return calculate_days_until_next_birthday(birthday.timestamp) <= calculate_days_until_next_birthday(v.timestamp);
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
    if (sortedArray[oldBirthdayIndex].timestamp === newBirthday.timestamp) {
        const cpySortedArray = [...sortedArray];
        cpySortedArray[oldBirthdayIndex] = newBirthday;
        return cpySortedArray;
    }
    return upd_sorted_array(sortedArray, oldBirthdayIndex, newBirthday, (v) => newBirthday.timestamp <= v.timestamp);
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