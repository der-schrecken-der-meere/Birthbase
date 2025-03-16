import { NotificationGroupType, NotificationType } from "@/database/tables/notifications/notifications";
import {
    type AddSignature,
    type DelSignature,
    type UpdSignature,
    add_worker_notifications,
    del_worker_notifications,
    upd_worker_notifications,
} from "../communication/sender";
import { VersionNumber } from "@/lib/types/number";

const add_worker_update_available_notifications: AddSignature<NotificationGroupType.INFO> = (
    key,
    timestamp,
) => {
    add_worker_notifications(key, timestamp, NotificationGroupType.INFO, {
        type: NotificationType.UPDATE_AVAILABLE,
        version: key as VersionNumber,
    });
};
const add_worker_update_installed_notifications: AddSignature<NotificationGroupType.INFO> = (
    key,
    timestamp,
) => {
    add_worker_notifications(key, timestamp, NotificationGroupType.INFO, {
        type: NotificationType.UPDATE_INSTALLED,
        version: key as VersionNumber,
    });
};
const del_worker_info_notifications: DelSignature = (
    key,
    timestamp,
) => {
    del_worker_notifications(key, timestamp, NotificationGroupType.INFO);
};
const upd_worker_info_notifications: UpdSignature = (
    key,
    old_timestamp,
    new_timestamp,
) => {
    upd_worker_notifications(key, old_timestamp, new_timestamp, NotificationGroupType.INFO);
};

export {
    add_worker_update_available_notifications,
    add_worker_update_installed_notifications,
    del_worker_info_notifications,
    upd_worker_info_notifications,
};