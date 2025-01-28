import { isTauri } from "@tauri-apps/api/core";
import {
    isPermissionGranted as tauri_is_permission_granted,
    requestPermission as tauri_request_permission,
    sendNotification as tauri_send_notification,
    type Options
} from "@tauri-apps/plugin-notification";
import { GlobalErrors } from "@/globals/constants/errors";

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
        const str_permission = await tauri_request_permission();
        return Promise.resolve(str_permission);
    } catch (error) {
        return Promise.resolve(GlobalErrors.UNSUPPORTED);
    }
};

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
        const bool_permission = await tauri_is_permission_granted();
        return Promise.resolve(bool_permission ? "granted": "denied");
    } catch (error) {
        return Promise.resolve(GlobalErrors.UNSUPPORTED);
    }
};

/**
 * Triggers the callback when the user changes the permission for notifications 
 * @returns - A promise resolving to void or:
 * 
 * "unsupported" - This feature is not supported by the system.
 * 
 */
const on_notification_permission_change = async (
    callback: (state: NotificationPermission) => void
): Promise<void|GlobalErrors.UNSUPPORTED> => {
    if (!navigator?.permissions?.query) {
        return Promise.resolve(GlobalErrors.UNSUPPORTED);
    }
    const obj_permission = await navigator.permissions.query({ name: "notifications" });
    obj_permission.onchange = () => callback(
        obj_permission.state === "prompt" ? "default" : obj_permission.state
    );
};

/**
 * Sends a notification. 
 * 
 * Permisson will be requested if no permission is granted.
 * 
 * @returns - A promise resolving to nothing if the system has the permission to display notification or:
 * 
 * "denied" - The user refuses to have notifications displayed.
 * 
 * "unsupported" - This feature is not supported by the system.
 * 
 */
const send_notification = async (options: Options): Promise<void | "denied" | GlobalErrors.UNSUPPORTED> => {
    let str_permission = await get_notification_permission();
    if (str_permission !== "granted") {
        str_permission = await request_notification_permission();
    }
    if (str_permission === "default") {
        str_permission = "denied";
    }
    if (str_permission !== "granted") {
        return Promise.resolve(str_permission);
    }
    if (!isTauri()) {
        const { title, ...obj_options } = options;
        new Notification(options.title, obj_options);
        return Promise.resolve();
    }
    tauri_send_notification(options);
};

export {
    get_notification_permission,
    request_notification_permission,
    on_notification_permission_change,
    send_notification
};