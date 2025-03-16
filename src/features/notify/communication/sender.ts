import { AppNotificationProps, NotificationGroupType, NotificationType } from "@/database/tables/notifications/notifications";
import { Action } from "../core";
import { send_message } from "../notify";
import { VersionNumber } from "@/lib/types/number";

type AddSignature<T extends NotificationGroupType> = (
    key: number | string,
    timestamp: number,
    data: Extract<AppNotificationProps, { group_type: T }>["data"],
) => void;
type DelSignature = (key: number | string, timestamp: number) => void;
type UpdSignature = (key: number | string, old_timestamp: number, new_timestamp: number) => void;



const add_worker_notifications = <T extends NotificationGroupType>(
    key: number | string,
    timestamp: number,
    group_type: T,
    data: Extract<AppNotificationProps, { group_type: T }>["data"]
) => {
    send_message([{
        action: Action.ADD,
        /** @ts-ignore */
        new_data: {
            group_type,
            timestamp,
            data,
        },
        id: key,
    }]);
};
const del_worker_notifications = (
    key: number | string,
    timestamp: number,
    group_type: NotificationGroupType
) => {
    send_message([{
        action: Action.DEL,
        old_data: {
            group_type,
            timestamp,
        },
        id: key,
    }]);
};
const upd_worker_notifications = (
    key: number | string,
    old_timestamp: number,
    new_timestamp: number,
    group_type: NotificationGroupType,
) => {
    send_message([{
        action: Action.UPD,
        old_data: {
            group_type,
            timestamp: old_timestamp,
        },
        new_data: {
            group_type,
            timestamp: new_timestamp,
        },
        id: key,
    }]);
};

export type {
    AddSignature,
    DelSignature,
    UpdSignature,
}
export {
    add_worker_notifications,
    del_worker_notifications,
    upd_worker_notifications,
};