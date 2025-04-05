import {
    NotificationQueue,
} from "./notification_queue";
import {
    type AddNotificationRequest,
    type DelNotificationRequest,
    type UpdNotificationRequest,
    Action,
} from "./core";
import { Errors } from "./errors";
import { AppNotificationProps, NotificationGroupType } from "@/database/tables/notifications/notifications";

const queue = new NotificationQueue<NotificationGroupType, AppNotificationProps["data"]>();
let timeout: number | null = null;



const post_error = (error: string) => {
    self.postMessage({ error });
};
const send_notifications = async (notifications: AppNotificationProps[]) => {
    self.postMessage({ data: notifications });
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
        const notifications = queue.del_item_copy(0).types;
        const transformed_notifications: AppNotificationProps[] = [];
        notifications.forEach((type) => {
            type.notifications.forEach((notification) => {
                transformed_notifications.push({
                    group_type: type.type,
                    data: notification as any,
                })
            })
        });
        await send_notifications(transformed_notifications);
        keep_alive();
    }, ms);
};

const add_item = ({
    id,
    new_data: {
        timestamp,
        group_type,
        data,
    }
}: AddNotificationRequest) => {
    queue.add_notification(
        timestamp,
        group_type,
        {
            ...data,
            id: id as number,
        }
    );
};
const del_item = ({
    id,
    old_data: {
        timestamp,
        group_type,
    }
}: DelNotificationRequest) => {
    queue.del_notification(
        timestamp,
        group_type,
        {
            id: id as number,
        }
    );
};
const upd_item = ({
    id,
    old_data: {
        timestamp: old_timestamp,
        group_type: old_group_type,
    },
    new_data: {
        timestamp: new_timestamp,
        group_type: new_group_type,
    }
}: UpdNotificationRequest) => {
    queue.upd_notification(
        old_timestamp,
        new_timestamp,
        old_group_type,
        new_group_type,
        {
            id: id as number,
        }
    )
};

let WorkerPort: MessagePort;

const on_message = (
    e: MessageEvent<
        ((AddNotificationRequest | UpdNotificationRequest | DelNotificationRequest)[]) &
        {code?: "port"}
    >
) => {
    const requests = e.data;

    if (requests?.code === "port") {
        WorkerPort = e.ports[0];
        WorkerPort.onmessage = on_message;
        return;
    }

    console.log(requests);

    let timestamp_before: number | null = null;
    let first_mq_item = queue.get_item(0);
    if (first_mq_item) {
        timestamp_before = 0 + first_mq_item.timestamp;
    }

    for (const request of requests) {
        switch (request.action) {
            case Action.ADD:
                add_item(request);
                break;
            case Action.DEL:
                del_item(request);
                break;
            case Action.UPD:
                upd_item(request);
                break;
            default:
                post_error(Errors.RUN);
                break;
        }
    }

    first_mq_item = queue.get_item(0);
    if (first_mq_item?.timestamp !== timestamp_before) {
        set_timeout();
    }
};

self.onmessage = on_message;

// Logging
setInterval(() => {
    console.log(queue.queue, timeout);
}, 10_000);