import { NotificationGroupType, type AppNotificationProps } from "@/database/tables/notifications/notifications";
import { Errors } from "./errors";

enum Action {
    ADD,
    DEL,
    UPD,
};



type NotificationResponse = {
    error?: Errors,
    timestamp: number,
    data: AppNotificationProps[],
};
type NotificationRequestUpdateParams = {
    /** When the notification will be triggered */
    timestamp: number,
    group_type: NotificationGroupType,
};
type AddNotificationRequest = {
    /** ID of the resource to search for */
    id: number | string,
    action: Action.ADD,
    new_data: AppNotificationProps & NotificationRequestUpdateParams,
};
type DelNotificationRequest = {
    /** ID of the resource to search for */
    id: number | string,
    action: Action.DEL,
    old_data: NotificationRequestUpdateParams,
};
type UpdNotificationRequest = {
    /** ID of the resource to search for */
    id: number | string,
    action: Action.UPD,
    old_data: NotificationRequestUpdateParams,
    new_data: NotificationRequestUpdateParams,
};

export type {
    AddNotificationRequest,
    DelNotificationRequest,
    UpdNotificationRequest,
    NotificationResponse,
};
export {
    Action,
};