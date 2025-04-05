import { GlobalErrors } from "@/globals/constants/errors";
import { isTauri } from "@tauri-apps/api/core";
import { requestPermission } from "@tauri-apps/plugin-notification";

/**
 * Request permission for displaying notifications
 * @returns - A promise resolving to the permission picked by the user
 * 
 * "default" - The user choice is unknown and therefore the browser will act as if the value were denied.
 * 
 * "granted" - The user accepts having notifications displayed.
 * 
 * "denied" - The user refuses to have notifications displayed.
 * 
 * "unsupported" - This feature is not supported by the system.
 * 
 */
const request_notification_permission = async (): Promise<NotificationPermission|GlobalErrors.UNSUPPORTED> => {
    try {
        if (!isTauri()) {
            if (!window?.Notification) {
                return Promise.resolve(GlobalErrors.UNSUPPORTED);
            }
            if (!Notification?.requestPermission) {
                return Promise.resolve(GlobalErrors.UNSUPPORTED);
            }
            const str_permission = await Notification.requestPermission();
            return Promise.resolve(str_permission);
        }
        const str_permission = await requestPermission();
        return Promise.resolve(str_permission);
    } catch (error) {
        return Promise.resolve(GlobalErrors.UNSUPPORTED);
    }
};

export { request_notification_permission };