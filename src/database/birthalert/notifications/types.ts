// External features
import type { VersionNumber } from "src/lib/types/number";

// Internal features
import type { NotificationGroup } from "./enums/group";
import type { NotificationType } from "./enums/type";

type AppNotificationData = {
    group: NotificationGroup.BIRTHDAY,
    data: {
        /** ID of birthday */
        id: number,
    },
} | {
    group: NotificationGroup.BIRTHDAY_REMINDER,
    data: {
        /** ID of birthday */
        id: number,
    },
} | {
    group: NotificationGroup.INFO,
    data: {
        type: NotificationType.UPDATE_AVAILABLE | NotificationType.UPDATE_INSTALLED,
        /** Version of the update */
        version: VersionNumber,
    },
};

type AppNotification = AppNotificationData & {
    /** Indicates whether the notification has been read */
    read: boolean,
    /** When the notification was triggered */
    timestamp: number,
};

export type {
    AppNotification,
    AppNotificationData,
};