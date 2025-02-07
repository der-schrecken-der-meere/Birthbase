import { Birthday } from "@/database/tables/birthday/birthdays";
import { add_birthdays_model, upd_birthdays_model, del_birthdays_model, clear_birthday_model, get_birthday_model } from "@/database/tables/birthday/db_model";
import {
    add_birthday_notification,
    del_birthday_notification,
    upd_birthday_notification,
} from "@/features/notify/notify";
import { format_date_to_iso_midnight } from "@/lib/intl/date";
import { ISOMidnightFullTZ } from "@/lib/types/date";

const locale = "de";
const timezone = "Europe/Berlin";

const get_next_birthday = (
    locale: Intl.LocalesArgument,
    timezone: Intl.DateTimeFormatOptions["timeZone"],
    date: ISOMidnightFullTZ,
) => {
    const obj_now = new Date(format_date_to_iso_midnight(locale, timezone));
    const obj_birth = new Date(date);

    obj_birth.setFullYear(obj_now.getFullYear());

    console.log(obj_now, obj_birth);

    if (obj_now > obj_birth) {
        obj_birth.setFullYear(obj_now.getFullYear() + 1);
    }

    return format_date_to_iso_midnight(locale, timezone, new Date(+obj_birth));
};

const add_birthday_middleware = async (birthday: Birthday): Promise<Birthday> => {
    try {

        console.log(birthday.date);

        birthday.date = format_date_to_iso_midnight(locale, timezone, new Date(birthday.date));

        const new_birthday = await add_birthdays_model([birthday]) as Birthday;

        // Get the midnight string when the 
        const trigger_iso = get_next_birthday(locale, timezone, new_birthday.date);

        const cpy_new_birthday: Birthday = { ...new_birthday, ...{ date: trigger_iso } };

        add_birthday_notification(cpy_new_birthday);
        return new_birthday;
    } catch (e) {
        return Promise.reject(e);
    }
};

const upd_birthday_middleware = async (birthday: Birthday): Promise<Birthday> => {
    try {
        const old_birthday = await get_birthday_model(birthday.id);
        const old_timestamp = get_next_birthday(locale, timezone, old_birthday.date);
        birthday.date = format_date_to_iso_midnight(locale, timezone, new Date(birthday.date));
        const obj_birthday = await upd_birthdays_model([birthday]) as Birthday;
        upd_birthday_notification(obj_birthday, old_timestamp);
        return Promise.resolve(obj_birthday);
    } catch (e) {
        return Promise.reject(e);
    }
};

const del_birthday_middleware = async (birthday: Birthday): Promise<number> => {
    try {
        await del_birthdays_model([birthday.id]);
        del_birthday_notification(birthday);
        return birthday.id;
    } catch (e) {
        return Promise.reject(e);
    }
};

const clear_birthday_middleware = async () => {
    try {
        return await clear_birthday_model();
    } catch (e) {
        return Promise.reject(e);
    }
};

export {
    add_birthday_middleware,
    upd_birthday_middleware,
    del_birthday_middleware,
    clear_birthday_middleware,
};