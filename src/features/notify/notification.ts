import { type Request, type Response } from "./notification_worker";
import { BirthdayQueueItem } from "./queue";
import { send_notification as tauri_send_notification } from "@/apis/tauri_notification";
import { ISODateFullTZ } from "@/lib/types/date";
import { dispatch_toast_error } from "@/lib/events/dispatch";
import { get_settings_model } from "@/database/tables/settings/db_model";
import { add_notification_middleware } from "@/middleware/notification";
import { get_default_notification } from "@/database/tables/notifications/notifications";
import { get_birthday_model } from "@/database/tables/birthday/db_model";
import { get_relative_time_string } from "@/lib/functions/date/relative_time";
import { format_number_to_relative_time } from "@/lib/formats/date";
import { add_notification_query_client } from "../latest_notifications/query";
import { queryClient } from "@/frontend/pre_react_init";
// import { queryClient } from "@/components/main";

// Contants
enum BirthdayTask {
    ADD = "add",
    UPD = "update",
    DEL = "delete",
};

enum Errors {
    RUN_ERR = "Ein Fehler ist bei der Benachrichtigung aufgetreten.",
    NO_RIGHTS = "Sie haben das Senden von Benachrichtigungen nicht erlaubt.",
    NO_SUPPORT = "Das Senden von Benachrichtigungen wird nicht unterstützt.",
};



// Variables
let obj_notification_worker: Worker | null = null;



// functions
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
}

const send_notification = async (birthdayData: BirthdayQueueItem) => {
    
    const res = await tauri_send_notification({
        title: `Heute haben ${birthdayData.birthdayIDs.length} ihren Geburtstag`,
    });
    if (res === "denied") {
        dispatch_toast_error({
            title: Errors.RUN_ERR,
            description: Errors.NO_RIGHTS,
        })
        return;
    }
    if (res === "unsupported") {
        dispatch_toast_error({
            title: Errors.RUN_ERR,
            description: Errors.NO_RIGHTS,
        })
    }
};

const on_message = async (e: MessageEvent<Response>) => {
    const res = e.data;

    if (!res.date || !res.birthdayIDs) {
        dispatch_toast_error({
            title: Errors.RUN_ERR,
        })
        return;
    }
    
    const obj_today = new Date();
    obj_today.setHours(0, 0, 0, 0);

    const obj_birthday = new Date(res.date.getFullYear(), res.date.getMonth(), res.date.getDate());
    obj_birthday.setHours(0, 0, 0, 0);

    const texts: string[] = [];
    const today = +obj_birthday === +obj_today;
    const past = +obj_birthday < +obj_today;

    const obj_time = get_relative_time_string(+obj_birthday, +obj_today);
    const str_time_pasted = format_number_to_relative_time("de", -obj_time.time, obj_time.unit);

    for (const [_, n] of res.birthdayIDs.entries()) {
        const birthday = await get_birthday_model(n);
        const str_text = `${birthday.name.first} ${birthday.name.last} ${past ? "hatte" : "hat"} ${today ? "heute" : str_time_pasted} Geburtstag`;
        texts.push(str_text);
        
        const notification = await add_notification_middleware({
            ...get_default_notification(),
            ...{
                text: str_text,
            },
        });
        add_notification_query_client(notification, queryClient);
    }

    const settings = await get_settings_model();

    if (settings.notification) {
        await send_notification(res as BirthdayQueueItem);
    }
};

const sendMessage = (req: Request) => {
    if (obj_notification_worker) {
        obj_notification_worker.postMessage(req);
    }
};

const add_birthday_notification = (birthdayId: number, date: ISODateFullTZ) => {
    sendMessage({
        task: BirthdayTask.ADD,
        birthdayId,
        dateNew: date,
    });
};

const upd_birthday_notification = (birthdayId: number, dateOld: ISODateFullTZ, dateNew: ISODateFullTZ) => {
    sendMessage({
        task: BirthdayTask.UPD,
        birthdayId,
        dateOld,
        dateNew,
    });
};

const del_birthday_notification = (birthdayId: number, date: ISODateFullTZ) => {
    sendMessage({
        task: BirthdayTask.DEL,
        birthdayId,
        dateOld: date,
    });
};

export {
    set_notification_worker,
    unset_notification_worker,
    add_birthday_notification,
    del_birthday_notification,
    upd_birthday_notification,
    send_notification,
    BirthdayTask,
};