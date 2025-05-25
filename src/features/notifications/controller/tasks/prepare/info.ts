// Packages
import type { Options } from "@tauri-apps/plugin-notification";

// External features
import type { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { NotificationType } from "@/database/birthalert/notifications/enums/type";

// Internal features
import type { PrepareNotificationFn } from "@/features/notifications/types/prepare";
import { create_default_options } from "@/features/notifications/lib/fn/default_options";

const prepare_info_notification: PrepareNotificationFn<NotificationGroup.INFO> = async (
    notification,
    t
) => {
    const { data: { version, type } } = notification;
    let options: Options;
    switch (type) {
        case NotificationType.UPDATE_AVAILABLE:
            options = create_default_options(
                t,
                "info.update_available",
                undefined,
                {
                    version,
                }
            );
            break;
        case NotificationType.UPDATE_INSTALLED:
            options = create_default_options(
                t,
                "info.update_installed",
                undefined,
                {
                    version,
                }
            );
            break;
    };
    return {
        notification,
        options
    };
};

export { prepare_info_notification };