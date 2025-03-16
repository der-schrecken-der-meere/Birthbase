import { type Birthday } from "@/database/tables/birthday/birthdays";
import { add_birthdays_model, upd_birthdays_model, del_birthdays_model, clear_birthday_model, get_birthday_model } from "@/database/tables/birthday/db_model";
import {
    add_worker_birthday_notifications,
    del_worker_birthday_notifications,
    upd_worker_birthday_notifications,
} from "@/features/notify/types/birthday_notification";
import { get_next_birthday, unify_birthday } from "@/lib/functions/birthday";
import { del_notification_middleware } from "./notification";
import { del_query_client_notification } from "@/features/latest_notifications/query";
import { AppNotification, NotificationGroupType } from "@/database/tables/notifications/notifications";
import { queryClient } from "@/frontend/pre_react_init";


const add_birthday_middleware = async (birthday: Birthday): Promise<Birthday> => {
    try {

        const unified_birthday = unify_birthday(birthday);

        const new_birthday = await add_birthdays_model([unified_birthday]) as Birthday;

        // The timestamp when the notification will be triggered 
        const new_timestamp = get_next_birthday(new_birthday.timestamp);
        console.log(new_birthday.timestamp, new_timestamp);

        const { id } = new_birthday;

        add_worker_birthday_notifications(id, new_timestamp, { id });
        return Promise.resolve(new_birthday);
    } catch (e) {
        return Promise.reject(e);
    }
};

const upd_birthday_middleware = async (birthday: Birthday): Promise<Birthday> => {
    try {
        const { timestamp } = await get_birthday_model(birthday.id);

        const unified_birthday = unify_birthday(birthday);

        const new_birthday = await upd_birthdays_model([unified_birthday]) as Birthday;

        const old_timestamp = get_next_birthday(timestamp);
        const new_timestamp = get_next_birthday(new_birthday.timestamp);

        const { id } = new_birthday;

        upd_worker_birthday_notifications(id, old_timestamp, new_timestamp);
        return Promise.resolve(new_birthday);
    } catch (e) {
        return Promise.reject(e);
    }
};

const del_birthday_middleware = async (birthday: Birthday): Promise<number> => {
    try {

        const { id, timestamp } = birthday;
        const old_timestamp = get_next_birthday(timestamp);

        await del_birthdays_model([birthday.id]);
        const notification_id = del_query_client_notification(NotificationGroupType.BIRTHDAY, (item) => item.data.id === id, queryClient) as AppNotification|null;
        if (notification_id != null) {
            await del_notification_middleware(notification_id);
        }
        del_worker_birthday_notifications(id, old_timestamp);
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