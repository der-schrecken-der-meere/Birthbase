import { NotificationGroupType } from "@/database/tables/notifications/notifications";
import { add_worker_notifications, AddSignature, del_worker_notifications, DelSignature, upd_worker_notifications, UpdSignature } from "../communication/sender";

const add_worker_birthday_notifications: AddSignature<NotificationGroupType.BIRTHDAY> = (
    key,
    timestamp,
    data,
) => {
    add_worker_notifications(key, timestamp, NotificationGroupType.BIRTHDAY, data);
};
const del_worker_birthday_notifications: DelSignature = (
    key,
    timestamp,
) => {
    del_worker_notifications(key, timestamp, NotificationGroupType.BIRTHDAY);
};
const upd_worker_birthday_notifications: UpdSignature = (
    key,
    old_timestamp,
    new_timestamp,
) => {
    upd_worker_notifications(key, old_timestamp, new_timestamp, NotificationGroupType.BIRTHDAY);
};

export {
    add_worker_birthday_notifications,
    del_worker_birthday_notifications,
    upd_worker_birthday_notifications,
};