// Packages
import { QueryClient } from "@tanstack/react-query";

// External features
import type { DBRecord } from "@/types/db";
import type { AppNotification } from "@/database/birthalert/notifications/types";

// Internal features
import { NotificationQueueChache } from "../../types/query";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { createNotificationCache } from "./cache";

const addQueryClientNotification = (
    notification: AppNotification & DBRecord,
    queryClient: QueryClient
) => {
    queryClient.setQueryData<NotificationQueueChache>(
        [NOTIFICATION_QUERY_KEY],
        (oldCache) => {
            if (!oldCache) return createNotificationCache([notification]);
            const { not_read, filter } = oldCache;

            filter.addItem(notification.group, notification);

            return {
                not_read: not_read + 1,
                filter,
            };
        }
    );
};

export { addQueryClientNotification };