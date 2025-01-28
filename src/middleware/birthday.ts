import { Birthday } from "@/database/tables/birthday/birthdays";
import { add_birthdays_model, upd_birthdays_model, del_birthdays_model } from "@/database/tables/birthday/db_model";
import { add_birthday_notification, del_birthday_notification, upd_birthday_notification } from "@/features/notify/notification";

const add_birthday_middleware = async (birthday: Birthday): Promise<Birthday> => {
    try {
        const obj_birthday = await add_birthdays_model([birthday]) as Birthday;
        add_birthday_notification(obj_birthday.id, birthday.date);
        return obj_birthday;
    } catch (e) {
        return Promise.reject(e);
    }
};

const upd_birthday_middleware = async (birhtday: Birthday): Promise<Birthday> => {
    try {
        const obj_birthday = await upd_birthdays_model([birhtday]) as Birthday;
        upd_birthday_notification(obj_birthday.id, birhtday.date, obj_birthday.date);
        return Promise.resolve(obj_birthday);
    } catch (e) {
        return Promise.reject(e);
    }
};

const del_birthday_middleware = async (birthday: Birthday): Promise<number> => {
    try {
        await del_birthdays_model([birthday.id]);
        del_birthday_notification(birthday.id, birthday.date);
        return birthday.id;
    } catch (e) {
        return Promise.reject(e);
    }
};

export {
    add_birthday_middleware,
    upd_birthday_middleware,
    del_birthday_middleware,
};