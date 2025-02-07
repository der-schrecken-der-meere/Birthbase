import { CoreRecord } from "@/database/db_types";
import { NotificationType } from "@/features/notify/notify";

type NoIDNotification = {
    text: string,
    read: boolean,
    timestamp: number,
    type: NotificationType,
};

type PartialIDNotification = NoIDNotification & Partial<CoreRecord>;

type Notification = CoreRecord & NoIDNotification;

const get_default_notification = (): Notification => {
    return {
        id: -1,
        read: false,
        text: "",
        timestamp: Date.now(),
        type: NotificationType.BIRTHDAY,
    };
};

export type { Notification, PartialIDNotification, NoIDNotification };
export { get_default_notification };