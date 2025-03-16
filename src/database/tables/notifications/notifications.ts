import type { VersionNumber } from "@/lib/types/number";
import type { CoreRecord } from "@/database/db_types";

enum NotificationGroupType {
    BIRTHDAY,
    BIRTHDAY_REMINDER,
    INFO,
};
enum NotificationType {
    BIRTHDAY,
    BIRTHDAY_REMINDER,
    UPDATE_AVAILABLE,
    UPDATE_INSTALLED,
};



type AppNotificationProps = {
    group_type: NotificationGroupType.BIRTHDAY,
    data: {
        id: number
    },
} | {
    group_type: NotificationGroupType.BIRTHDAY_REMINDER,
    data: {
        id: number
    },
} | {
    group_type: NotificationGroupType.INFO,
    data: {
        type: NotificationType.UPDATE_AVAILABLE,
        version: VersionNumber,
    } | {
        type: NotificationType.UPDATE_INSTALLED,
        version: VersionNumber,
    },
};
type AppNotification = AppNotificationProps & CoreRecord & {
    /** Whether the notification is read */
    read: boolean,
    /** Whenn the notification will be triggered */
    timestamp: number,
};



/**
 * Creates a default app notification with default values
 * @returns A new app notification
 */
const create_default_notification = (): AppNotification => {
    return {
        id: -1,
        group_type: NotificationGroupType.BIRTHDAY,
        read: false,
        timestamp: Date.now(),
    } as AppNotification;
};

export type {
    AppNotification,
    AppNotificationProps,
};
export {
    NotificationType,
    NotificationGroupType,
    create_default_notification,
};