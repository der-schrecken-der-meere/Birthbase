import { GlobalErrors } from "@/globals/constants/errors";
import { isTauri } from "@tauri-apps/api/core";
import { isPermissionGranted } from "@tauri-apps/plugin-notification";

/**
 * Gets the current permission for sending notifications
 * @returns - A promise resolving to the current permisson or if this feature unsupported
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
const get_notification_permission = async (): Promise<NotificationPermission|GlobalErrors.UNSUPPORTED> => {
    try {
        if (!isTauri()) {
            if (Notification?.permission) {
                return Promise.resolve(Notification.permission);
            }
            // @ts-ignore It's possible in older version that permissions is not available
            if (navigator?.permissions.query) {
                return Promise.resolve(GlobalErrors.UNSUPPORTED);
            };
            const obj_permission = await navigator.permissions.query({ name: "notifications" });
            return Promise.resolve(obj_permission.state === "prompt" ? "default": obj_permission.state);
        }
        const bool_permission = await isPermissionGranted();
        return Promise.resolve(bool_permission ? "granted": "denied");
    } catch (error) {
        return Promise.resolve(GlobalErrors.UNSUPPORTED);
    }
};

export { get_notification_permission };