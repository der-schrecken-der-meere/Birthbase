import type { AppNotification } from "./types";

const create_default_notification = (): Partial<AppNotification> => ({
    read: false,
    timestamp: Date.now(),
});

export { create_default_notification };