import { GlobalErrors } from "@/globals/constants/errors";
import { Options, sendNotification } from "@tauri-apps/plugin-notification";
import { get_notification_permission } from "./get_notification_perm";
import { request_notification_permission } from "./req_notification_perm";
import { isTauri } from "@tauri-apps/api/core";

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
    sendNotification(options);
};

export { send_notification };