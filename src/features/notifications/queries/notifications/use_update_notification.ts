import { AppNotification } from "@/database/birthalert/notifications/types";
import { DBRecord } from "@/types/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationMiddleware } from "../../lib/instances/middleware";
import { NotificationQueueChache } from "../../types/query";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { createNotificationCache } from "./cache";

const useUpdateNotificationQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notification: (AppNotification & DBRecord))=> {
            const res = await notificationMiddleware.updateNotifications([notification]);
            return [res[0], notification];
        },
        onSuccess: ([oldNotification, newNotification]) => {
            queryClient.setQueryData<NotificationQueueChache>(
                [NOTIFICATION_QUERY_KEY],
                (old_data) => {
                    if (!old_data) return createNotificationCache([newNotification]);
                    const { filter, not_read } = old_data;
                    filter.updateItem(oldNotification.group, oldNotification, newNotification);

                    return {
                        not_read: not_read + (newNotification.read ? -1 : 0),
                        filter,
                    }
                }
            );
        }
    });
};

export { useUpdateNotificationQuery };