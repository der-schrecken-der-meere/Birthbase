// Packages
import type { Options } from "@tauri-apps/plugin-notification";
import type { TFunction } from "i18next";

// External features
import type { AppNotification } from "@/database/birthalert/notifications/types";
import type { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import type { DBRecord } from "@/types/db";

type PreparedNotification = {
    notification: AppNotification & DBRecord,
    options: Options,
};

type PrepareNotificationFn<T extends NotificationGroup> = (
    notification: Extract<(AppNotification & DBRecord), { group: T }>,
    t: TFunction,
) => Promise<PreparedNotification>;

export type {
    PreparedNotification,
    PrepareNotificationFn,
}