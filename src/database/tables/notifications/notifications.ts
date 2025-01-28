import { CoreRecord } from "@/database/db_types";

type NoIDNotification = {
    text: string,
    read: boolean,
    timestamp: number,
};

type PartialIDNotification = NoIDNotification & Partial<CoreRecord>;

type Notification = CoreRecord & NoIDNotification;

const get_default_notification = (): Notification => {
    return {
        id: -1,
        read: false,
        text: "",
        timestamp: Date.now(),
    };
};

export type { Notification, PartialIDNotification, NoIDNotification };
export { get_default_notification };