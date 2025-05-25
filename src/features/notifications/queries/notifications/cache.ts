import { DBRecord } from "@/types/db";
import { createNotificationFilter } from "../../lib/instances/create/filtered_notifications";
import { createSortedNotification } from "../../lib/instances/create/sorted_notifications";
import type { NotificationQueueChache } from "../../types/query";
import { AppNotification } from "@/database/birthalert/notifications/types";

const createNotificationCache = (notifications?: (AppNotification & DBRecord)[]): NotificationQueueChache => ({
    not_read: 0,
    filter: createNotificationFilter(createSortedNotification(notifications)),
});

export { createNotificationCache };