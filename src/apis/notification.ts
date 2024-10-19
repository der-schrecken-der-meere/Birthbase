import { hasProperty } from "@/crossplatform_lib/object";

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
            if (hasProperty(Notification, "permission")) {
                resolve(Notification.permission);
            }
            if (hasProperty(navigator.permissions, "query")) {
                const result = await navigator.permissions.query({ name: "notifications" });
                resolve(result.state === "prompt" ? "default" : result.state);
            }
            resolve("unsupported");
        } catch (e) {
            resolve("unsupported");
        }
    });
};

/**
 * Triggers the callback when the user changes the permission for notifications 
 * @returns - A promise resolving to void or:
 * 
 * "unsupported" - This feature is not supported by the system.
 * 
 */
const onPermissionChange = (callback: (state: NotificationPermission) => void): Promise<void|"unsupported"> => {
    return new Promise(async (resolve) => {
        if (!hasProperty(navigator, "permissions")) resolve("unsupported");
        if (!hasProperty(navigator.permissions, "query")) resolve("unsupported");
        const result = await navigator.permissions.query({ name: "notifications" });
        result.onchange = () => callback(result.state === "prompt" ? "default" : result.state);
    })
}

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
            if (!hasProperty(window, "Notification")) {
                resolve("unsupported");
            } 
            if (!hasProperty(Notification, "requestPermission")) {
                resolve("unsupported");
            }
            const permission = await Notification.requestPermission();
            resolve(permission);
        } catch (e) {
            resolve("unsupported");
        }
    });
};

type NotificationConfig = {
    onClick?: () => void,
    onClose?: () => void,
    onShow?: () => void,
    onError?: () => void,
    options?: NotificationOptions,
    title: string,
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
const send = (config: NotificationConfig): Promise<"denied"|"unsupported"> => {
    return new Promise(async (resolve) => {
        const createNotification = (config: NotificationConfig) => {
            const notification = new Notification(config.title, config.options);
            if (config.onClick) notification.onclick = config.onClick;
            if (config.onClose) notification.onclose = config.onClose;
            if (config.onError) notification.onerror = config.onError;
            if (config.onShow) notification.onshow = config.onShow;
        }

        const permission = await currentPermission();
        if (permission === "granted") {
            createNotification(config);
        } else {
            const result = await requestPermission();
            if (result === "unsupported" || result === "denied") resolve(result);
            if (result === "default") resolve("denied");
            createNotification(config);
        }
    });
};

export type { NotificationConfig };
export { currentPermission, onPermissionChange, requestPermission, send };