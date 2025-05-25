// Packages
import { isPermissionGranted, type Options, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { NotificationError } from "../constants/enums/error";

/**
 * Send native notification
 * 
 * If no permission is granted the user will be asked from the os to allow receiving notifications
 * 
 * @param options Notification options or the title of the notification
 * @returns void
 */
const send_notification = async (options: string | Options) => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (!permissionGranted) {
        Promise.reject(NotificationError.NO_RIGHT);
    }
    sendNotification(options);
};

export { send_notification };