import { GlobalErrors } from "@/globals/constants/errors";

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

export { on_notification_permission_change };