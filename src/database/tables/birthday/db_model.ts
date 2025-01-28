import type { Birthday, NoIDBirthday, PartialIDBirthday } from "./birthdays";
import { db, TABLES } from "@/database/db.ts";
import { has_property } from "../../../lib/functions/object/hasProperty";

/**
 * Add multiple birthdays
 */
const add_birthdays_model = async (birthdays: PartialIDBirthday[]) => {
    // Remove the id from all birhtdays
    const arr_birthdays: NoIDBirthday[] = birthdays.map((birthday) => {
        if (has_property(birthday, "id")) {
            // Dereference to prevent the change of the origin
            const obj_birthday = { ...birthday };
            delete obj_birthday.id;
            return obj_birthday;
        }
        return birthday;
    });
    try {
        const res = await db.add(TABLES.BIRTHDAYS, arr_birthdays);
        if (res.length === 1) {
            return Promise.resolve(res[0]);
        }
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Remove multiple birthdays
 */
const del_birthdays_model = async (birhtday_ids: number[]) => {
    try {
        const res = await db.del(TABLES.BIRTHDAYS, birhtday_ids);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Update multiple birthdays
 */
const upd_birthdays_model = async (birthdays: Birthday[]) => {
    try {
        const res = await db.upd(TABLES.BIRTHDAYS, birthdays);
        if (res.length === 1) {
            return Promise.resolve(res[0]);
        }
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Get a single birthday
 */
const get_birthday_model = (id: number) => {
    return db.get(TABLES.BIRTHDAYS, id);
};

/**
 * Get all birthdays
 */
const get_birthdays_model = () => {
    return db.get(TABLES.BIRTHDAYS);
};

export { get_birthday_model, get_birthdays_model, add_birthdays_model, upd_birthdays_model, del_birthdays_model };