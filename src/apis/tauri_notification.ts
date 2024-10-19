import { isTauri } from "@tauri-apps/api/core";
import { isPermissionGranted, requestPermission as _requestPermission } from "@tauri-apps/plugin-notification";
import * as NotificationAPI from "./notification";

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
const requestPermission = (): Promise<NotificationPermission|"unsupported"> => {
    return new Promise(async (resolve) => {
        try {
            if (!isTauri()) {
                const result = NotificationAPI.requestPermission()
                resolve(result);
            }
            const result = await _requestPermission();
            resolve(result);
        } catch (e) {
            resolve("unsupported");
        }
    });
}

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
const currentPermission = (): Promise<NotificationPermission|"unsupported"> => {
    return new Promise(async (resolve) => {
        try {
            if (!isTauri()) {
                const result = NotificationAPI.currentPermission();
                resolve(result);
            }
            const result = await isPermissionGranted();
            resolve(result ? "granted" : "denied");
        } catch (e) {
            resolve("unsupported");
        }
    });
}

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
const send = NotificationAPI.send;

/**
 * Triggers the callback when the user changes the permission for notifications 
 * @returns - A promise resolving to void or:
 * 
 * "unsupported" - This feature is not supported by the system.
 * 
 */
const onPermissionChange = NotificationAPI.onPermissionChange;

export { currentPermission, requestPermission, onPermissionChange, send };