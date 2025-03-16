import { send_notification } from "@/apis/tauri_notification";
import { get_birthday_model } from "@/database/tables/birthday/db_model";
import { create_default_notification, NotificationGroupType, NotificationType, type AppNotification, type AppNotificationProps } from "@/database/tables/notifications/notifications";
import { addNotificationQueryClient } from "@/features/latest_notifications/query";
import { queryClient } from "@/frontend/pre_react_init";
import i18n from "@/i18n/config";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";
import { add_notification_middleware } from "@/middleware/notification";
import { Options } from "@tauri-apps/plugin-notification";
import { TFunction } from "i18next";
import { $SpecialObject } from "node_modules/i18next/typescript/helpers";

type SendNotificationSignatureReturn = {
    db_notification: AppNotification,
    notification_options: Options,
};
type SendNotificationSignature<T extends NotificationGroupType> = (
    notification: Extract<AppNotificationProps, { group_type: T }>,
    t: TFunction
) => Promise<SendNotificationSignatureReturn>;

const send_birthday_notification: SendNotificationSignature<NotificationGroupType.BIRTHDAY> = async (
    { data: { id }, group_type },
    t,
) => {
    const birthday = await get_birthday_model(id);
    const notification_options = {
        title: t("birthday.title", { ns: "notification" }),
        body: t("birthday.body", {
            ns: "notification",
            count: calculate_days_until_next_birthday(birthday.timestamp),
            firstname: birthday.name.first,
            lastname: birthday.name.last
        }),
    };
    const db_notification = await add_notification_middleware({
        ...create_default_notification(),
        group_type,
        data: {
            id,
        },
    });
    return {
        db_notification,
        notification_options,
    };
};
const send_birthday_reminder_notification: SendNotificationSignature<NotificationGroupType.BIRTHDAY_REMINDER> = async (
    { data: { id }, group_type },
    t,
) => {
    const birthday = await get_birthday_model(id);
    const notification_options = {
        title: t("birthday_reminder.title", { ns: "notification" }),
        body: t("birthday.body", {
            ns: "notification",
            count: calculate_days_until_next_birthday(birthday.timestamp),
            firstname: birthday.name.first,
            lastname: birthday.name.last
        }),
    };
    const db_notification = await add_notification_middleware({
        ...create_default_notification(),
        group_type,
        data: {
            id,
        },
    });
    return {
        db_notification,
        notification_options,
    };
};
const send_info_notification: SendNotificationSignature<NotificationGroupType.INFO> = async (
    { data: { version, type }, group_type },
    t,
) => {
    let db_notification: AppNotification = {} as any;
    let title: string = "";
    let description: string = "";
    let data: $SpecialObject = {};
    switch (type) {
        case NotificationType.UPDATE_AVAILABLE:
            title = "update_available.title";
            description = "update_available.description";
            data = {
                version,
            }
            db_notification = await add_notification_middleware({
                ...create_default_notification(),
                group_type,
                data: {
                    version,
                    type,
                },
            });
            break;
        case NotificationType.UPDATE_INSTALLED:
            title = "update_installed.title";
            description = "update_installed.description";
            data = {
                version,
            }
            db_notification = await add_notification_middleware({
                ...create_default_notification(),
                group_type,
                data: {
                    version,
                    type,
                },
            });
            break;
    }
    console.log(group_type, title);
    return {
        db_notification,
        notification_options: {
            title: t(title, { ns: "notification" }),
            body: t(description, {
                ns: "notification",
                ...data,
            }),
        }
    };
};

const send_notifications = async (notifications: AppNotificationProps[], is_allowed: boolean) => {
    console.log(notifications);
    const { t } = i18n;

    for (const notification of notifications) {
        let obj_notification: SendNotificationSignatureReturn|null = null;
        switch (notification.group_type) {
            case NotificationGroupType.BIRTHDAY:
                obj_notification = await send_birthday_notification(
                    notification,
                    t
                );
                break;
            case NotificationGroupType.BIRTHDAY_REMINDER:
                obj_notification = await send_birthday_reminder_notification(
                    notification,
                    t
                );
                break;
            case NotificationGroupType.INFO:
                obj_notification = await send_info_notification(
                    notification,
                    t
                );
                break;
            default:
                break;
        }
        if (!obj_notification) {
            continue;
        }
        console.log(obj_notification);
        const { db_notification, notification_options } = obj_notification;
        addNotificationQueryClient(db_notification, queryClient);

        if (is_allowed && notification_options) {
            const res = await send_notification(notification_options);
            if (res != undefined) {
                return Promise.reject(res);
            }
        }
    }
};

export {
    send_notifications,
};