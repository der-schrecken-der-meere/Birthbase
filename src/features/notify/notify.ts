import type { NotificationRequest, NotificationResponse } from "./notification_worker";
import { Birthday } from "@/database/tables/birthday/birthdays";
import { send_notification } from "@/apis/tauri_notification";
import { get_settings_model } from "@/database/tables/settings/db_model";
import { add_notification_middleware } from "@/middleware/notification";
import { get_default_notification } from "@/database/tables/notifications/notifications";
import { add_notification_query_client } from "@/features/latest_notifications/query";
import { queryClient } from "@/frontend/pre_react_init";
import { ISOMidnightFullTZ } from "@/lib/types/date";
import { create_toast, ToastType } from "@/hooks/use_app_toast";

// Constants
enum Errors {
    RUN_ERR = "Ein Fehler ist bei der Benachrichtigung aufgetreten.",
    NO_RIGHTS = "Sie haben das Senden von Benachrichtigungen nicht erlaubt.",
    NO_SUPPORT = "Das Senden von Benachrichtigungen wird nicht unterstützt.",
};

enum Action {
    ADD,
    DEL,
    UPD, 
};

enum NotificationType {
    BIRTHDAY,
    BIRTHDAY_REMINDER,
    INFO,
};

// Variables
let obj_notification_worker: Worker | null = null;



// Functions
// Worker specific
const create_notification_worker = () => {
    return new Worker(new URL("./notification_worker", import.meta.url), {
        type: "module",
    });
};

const set_notification_worker = () => {
    if (!obj_notification_worker) {
        obj_notification_worker = create_notification_worker();
        obj_notification_worker.onmessage = on_message;
    }
};

const unset_notification_worker = () => {
    if (obj_notification_worker) {
        obj_notification_worker.terminate();
        obj_notification_worker = null;
    }
};

const sendMessage = (req: NotificationRequest) => {
    if (obj_notification_worker) {
        console.log("Sending Message to Worker:", req);
        obj_notification_worker.postMessage(req);
    }
};

const on_message = async (e: MessageEvent<NotificationResponse>) => {
    const res = e.data;

    if (res.error) {
        create_toast({
            title: Errors.RUN_ERR,
            description: res.error,
        }, ToastType.ERROR);
        return;
    }

    const permission = await get_settings_model();
    for (const notification of res.notifications as Exclude<typeof res.notifications, undefined>) {
        if (permission.notification) {
            await send_notification(notification);
        }
        const obj_notification = await add_notification_middleware({
            ...get_default_notification(),
            ...{
                text: notification.body,
                type: notification.type,
            },
        });
        add_notification_query_client(obj_notification, queryClient);
    }
};

const send_birthday_notification = (
    old_timestamp: number | null,
    new_timestamp: number | null,
    birthday: Birthday,
    action: Action,
) => {

    const { id, name: { first: firstname, last: lastname }, date } = birthday;

    sendMessage({
        old_type: NotificationType.BIRTHDAY,
        new_type: NotificationType.BIRTHDAY,
        action,
        id,
        firstname,
        lastname,
        date,
        old_timestamp,
        new_timestamp,
    });
};

const add_birthday_notification = (
    birthday: Birthday,
) => {

    const timestamp = new Date(birthday.date);

    send_birthday_notification(null, +timestamp, birthday, Action.ADD);
};

const upd_birthday_notification = (
    birthday: Birthday,
    old_date?: ISOMidnightFullTZ,
) => {

    const new_timestamp = new Date(birthday.date);

    const old_timestamp = new Date(old_date != null ? old_date : +new_timestamp);

    send_birthday_notification(+old_timestamp, +new_timestamp, birthday, Action.UPD);
};

const del_birthday_notification = (
    birthday: Birthday,
) => {

    const timestamp = new Date(birthday.date);

    send_birthday_notification(+timestamp, null, birthday, Action.DEL);
};

export {
    add_birthday_notification,
    upd_birthday_notification,
    del_birthday_notification,

    set_notification_worker,
    unset_notification_worker,

    Action,
    NotificationType,
};