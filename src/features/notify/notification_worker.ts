import { type ISODateFullTZ } from "@/lib/types/date";
import { create_timeouts, reset_timeout, set_timeout, calc_timeout } from "./timeouts";
import { create_birhtday_queue, add_birthday, del_birthday, upd_birthday, find_date } from "./queue";
import type { BirthdayQueueItem, BirthdayQueueEvent } from "./queue";
import { BirthdayTask } from "./notification";

type Request = {
    birthdayId: number,
    dateOld?: ISODateFullTZ,
    dateNew?: ISODateFullTZ,
    task: BirthdayTask,
};

type ErrorResponse = {
    error: string,
};

type Response = Partial<BirthdayQueueItem> & Partial<ErrorResponse>;



// Constants
enum Errors {
    NO_TASK_FOUND = "Task not found",
};



// Variables
const arr_birthday_queue = create_birhtday_queue();
const arr_timeouts = create_timeouts();

const process_event = (timeouts: number[], event: BirthdayQueueEvent) => {
    if (event.event === "none") return;
    if (event.event === "add") {
        reset_timeout(timeouts);
        create_timeout(event.date);
        return;
    }
    if (event.event === "empty") {
        reset_timeout(timeouts);
        return;
    }
}

const on_add_birthday = (birthdayId: number, dateNew: Date) => {
    const event = add_birthday(birthdayId, dateNew, arr_birthday_queue);
    process_event(arr_timeouts, event);
};

const on_upd_birthday = (birthdayId: number, dateOld: Date, dateNew: Date) => {
    const event = upd_birthday(birthdayId, dateOld, dateNew, arr_birthday_queue);
    process_event(arr_timeouts, event);
};

const on_del_birthday = (birthdayId: number, dateOld: Date) => {
    const event = del_birthday(birthdayId, dateOld, arr_birthday_queue);
    process_event(arr_timeouts, event);
};

const on_error = (e: any) => {
    send_notification(e);
};

const create_timeout = (date: Date) => {
    const timeout = calc_timeout(date);
    set_timeout(arr_timeouts, timeout, () => {
        reset_timeout(arr_timeouts);
        const index = find_date(date, arr_birthday_queue);
        if (typeof index === "number") {
            send_notification(arr_birthday_queue[index]);
            arr_birthday_queue.shift();
            if (arr_birthday_queue.length > 0) {
                create_timeout(arr_birthday_queue[0].date);
            }
        }
    });
};

const send_notification = (birthdayQueueItem: BirthdayQueueItem) => {
    postMessage(birthdayQueueItem);
};

self.onmessage = (e: MessageEvent<Request>) => {

    const task = e.data.task;
    const dateOld = e.data.dateOld ? new Date(e.data.dateOld) : new Date();
    const dateNew = e.data.dateNew ? new Date(e.data.dateNew) : new Date();
    const birthdayId = e.data.birthdayId;

    switch (task) {
        case BirthdayTask.ADD:
            on_add_birthday(birthdayId, dateNew);
            break;
        case BirthdayTask.UPD:
            on_upd_birthday(birthdayId, dateOld, dateNew);
            break;
        case BirthdayTask.DEL:
            on_del_birthday(birthdayId, dateOld);
            break;
        default:
            on_error({ error: Errors.NO_TASK_FOUND });
            break;
    }
};

// Logging
setInterval(() => {
    console.log(arr_birthday_queue, arr_timeouts);
}, 10_000);

export type { Request, Response };