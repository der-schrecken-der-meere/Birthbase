import { NotificationGroupType } from "@/database/tables/notifications/notifications";
import { add_worker_notifications, AddSignature, del_worker_notifications, DelSignature, upd_worker_notifications, UpdSignature } from "../communication/sender";

const add_worker_reminder_notifications: AddSignature<NotificationGroupType.BIRTHDAY_REMINDER> = (
    key,
    timestamp,
    data,
) => {
    add_worker_notifications(key, timestamp, NotificationGroupType.BIRTHDAY_REMINDER, data);
};
const del_worker_reminder_notifications: DelSignature = (
    key,
    timestamp,
) => {
    del_worker_notifications(key, timestamp, NotificationGroupType.BIRTHDAY_REMINDER);
};
const upd_worker_reminder_notifications: UpdSignature = (
    key,
    old_timestamp,
    new_timestamp,
) => {
    upd_worker_notifications(key, old_timestamp, new_timestamp, NotificationGroupType.BIRTHDAY_REMINDER);
};

export {
    add_worker_reminder_notifications,
    del_worker_reminder_notifications,
    upd_worker_reminder_notifications,
}