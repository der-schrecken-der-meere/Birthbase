// External features
import type { AppNotification } from "@/database/birthalert/notifications/types";
import type { DBRecord } from "@/types/db";
import { SortedArray } from "@/lib/classes/SortedArray";

const createSortedNotification = (notifications: (AppNotification & DBRecord)[] = []) => {
    const sorted = new SortedArray<AppNotification & DBRecord>((arrayItem, newItem) => {
        const r = arrayItem.timestamp - newItem.timestamp;
        if (r === 0) return arrayItem.id - newItem.id;
        return r;
    });
    if (notifications.length > 0) {
        sorted.add(...notifications);
    }
    return sorted;
}

export { createSortedNotification };