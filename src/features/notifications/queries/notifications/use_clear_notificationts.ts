import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NotificationQueueChache } from "../../types/query";
import { notificationMiddleware } from "../../lib/instances/middleware";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { createNotificationCache } from "./cache";

const useClearNotificationsQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await notificationMiddleware.clearNotifications();
        },
        onSuccess: () => {
            queryClient
                .setQueryData<NotificationQueueChache>(
                    [NOTIFICATION_QUERY_KEY],
                    () => createNotificationCache(),
                );
        }
    })
};

export { useClearNotificationsQuery };