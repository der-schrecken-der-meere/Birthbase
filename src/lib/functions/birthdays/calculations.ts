import type { ISODateFullTZ } from "@/lib/types/date";

/**
 * Calculates the days until the next birthday
 */
const calc_days_until_next_birthday = (birth_date: ISODateFullTZ, compare_date: ISODateFullTZ) => {
    const obj_birth_date = new Date(birth_date);
    const obj_compare_Date = new Date(compare_date);
    obj_birth_date.setFullYear(obj_compare_Date.getFullYear());
    obj_birth_date.setHours(0, 0, 0, 0);
    obj_compare_Date.setHours(0, 0, 0, 0);

    if (obj_compare_Date > obj_birth_date) {
        obj_birth_date.setFullYear(obj_compare_Date.getFullYear() + 1);
    }

    const diff_in_ms = +obj_birth_date - +obj_compare_Date;
    return Math.floor(diff_in_ms / (1000 * 60 * 60 * 24));
}

/**
 * Calculates the current age
 * 
 * @param birth_date - The birthdate
 * @param compare_date - The date to compare with
 */
const calcAge = (birth_date: number, compare_date: number) => {
    const obj_birth_date = new Date(birth_date);
    const obj_compare_date = new Date(compare_date);
    let age = obj_compare_date.getFullYear() - obj_birth_date.getFullYear();
    const month_diff = obj_compare_date.getMonth() - obj_birth_date.getMonth();
    const day_diff = obj_compare_date.getDate() - obj_birth_date.getDate();

    if (month_diff < 0 || (month_diff === 0 && day_diff < 0)) age--;

    return age;
}

export { calc_days_until_next_birthday, calcAge };