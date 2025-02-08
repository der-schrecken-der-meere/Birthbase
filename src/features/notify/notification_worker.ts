import { ISOMidnightFullTZ } from "@/lib/types/date";
import { type BirthdayItem, create_birthday_item, create_birthday_text } from "./types/birthday_notification";
import { Action, NotificationType } from "./notify";
import { Options } from "@tauri-apps/plugin-notification";
import { MessageQueueType, NotificationQueue } from "./notification_queue";

/*
    External dependencies
        - timezone
        - language
*/

const locale = "de";
const timeZone = "Europe/Berlin";

const template_past = "$1 $2 wurde vor $3 Tagen ($4) $5";
const template_future = "$1 $2 wird in $3 Tagen ($4) $5";
const template_present = "$1 $2 ist heute ($4) $5 geworden";

type ID = {
    id: number,
};

type BirthdayRequest = {
    /** Firstname */
    firstname: string,
    /** Lastname */
    lastname: string,
    /** Birthdate */
    date: ISOMidnightFullTZ,
};

type OptTimestamp = number | null;
type OptNotificationType = NotificationType | null;

type NotificationRequest = {
    /** Required on update or add */
    new_type: OptNotificationType,
    /** Required on update or delete */
    old_type: OptNotificationType,
    /** Which action will be performed */
    action: Action,
    /** Required on update or add */
    new_timestamp: OptTimestamp,
    /** Required on update or delete */
    old_timestamp: OptTimestamp,
    /** ID for searching in notifications array */
    id: number,
} & (BirthdayRequest);

type NotificationResponse = {
    /** Describing text of the error */
    error?: string,
    notifications?: {
        type: NotificationType,
        title: string,
        body: string,
    }[],
};

const queue = new NotificationQueue<NotificationType, (BirthdayItem)>();

let timeout: number | null = null;

self.onmessage = (e: MessageEvent<NotificationRequest>) => {
    const request = e.data;

    if (!request.new_type) {
        request.new_type = request.old_type;
    }

    console.log(request);

    switch (request.new_type) {
        case NotificationType.BIRTHDAY:
            const {
                action,
                old_timestamp,
                new_timestamp,
                old_type,
                new_type,
                id,
                firstname,
                lastname,
                date
            } = request;
            compute_birthday_item(
                old_timestamp,
                new_timestamp,
                old_type,
                new_type,
                action,
                {
                    id,
                    firstname,
                    lastname,
                    date,
                }
            );
            break;
        case NotificationType.INFO:
        case NotificationType.BIRTHDAY_REMINDER:
    }
};

const compute_birthday_item = (
    old_timestamp: OptTimestamp,
    new_timestamp: OptTimestamp,
    old_type: OptNotificationType,
    new_type: OptNotificationType,
    action: Action,
    birthday_request: BirthdayRequest & ID
) => {
    const { id, lastname, firstname, date } = birthday_request;
    const birthday_item = create_birthday_item(locale, timeZone, firstname, lastname, date);
    const mq_notification = { ...birthday_item, id };
    let timestamp_before: number | null = null;
    let first_mq_item = queue.get_item(0);
    if (first_mq_item) {
        timestamp_before = 0 + queue.get_item(0).timestamp;
    }

    switch (action) {
        case Action.ADD:
            queue.add_notification(
                new_timestamp as Exclude<typeof new_timestamp, null>,
                new_type as Exclude<typeof new_type, null>,
                mq_notification
            );
            break;
        case Action.DEL:
            queue.del_notification(
                old_timestamp as Exclude<typeof old_timestamp, null>,
                old_type as Exclude<typeof old_type, null>,
                mq_notification
            );
            break;
        case Action.UPD:
            queue.upd_notification(
                old_timestamp as Exclude<typeof new_timestamp, null>,
                new_timestamp as Exclude<typeof old_timestamp, null>,
                old_type as Exclude<typeof old_type, null>,
                new_type as Exclude<typeof new_type, null>,
                mq_notification
            );
            break;
    }

    first_mq_item = queue.get_item(0);
    if (first_mq_item?.timestamp !== timestamp_before) {
        set_timeout();
    }
};

const reset_timeout = () => {
    clearTimeout(timeout as any);
    timeout = null;
};

const keep_alive = () => {
    reset_timeout();
    if (queue.get_length() > 0) {
        set_timeout();
    }
};

const set_timeout = () => {
    if (timeout) reset_timeout();
    if (queue.get_length() === 0) return;
    const ms = queue.get_item(0).timestamp - Date.now();
    timeout = setTimeout(async () => {
        await send_notifications(queue.del_item_copy(0).types);
        keep_alive();
    }, ms);
};

const send_notifications = async (mqTypes: MessageQueueType<NotificationType, BirthdayItem>[]) => {
    let notifications = [];
    for (const mqType of mqTypes) {
        switch (mqType.type) {
            case NotificationType.BIRTHDAY:
                notifications.push(create_birthday_notifications(mqType.notifications));
                break;
            case NotificationType.INFO:
                break;
            case NotificationType.BIRTHDAY_REMINDER:
                break;
        };
    }
    notifications = notifications.flat();
    self.postMessage({ notifications });
};

const create_birthday_notifications = (birthday_items: BirthdayItem[]): Options[] => {
    return birthday_items.map((birthday_item) => {
        const notification_text = create_birthday_text(birthday_item, template_past, template_present, template_future) as string;
        return {
            title: "Geburtstag",
            body: notification_text,
            type: NotificationType.BIRTHDAY,
        };
    });
};

// Logging
// setInterval(() => {
//     console.log(queue.queue, timeout);
// }, 1_000);

export type { NotificationRequest, BirthdayRequest, NotificationResponse, ID };