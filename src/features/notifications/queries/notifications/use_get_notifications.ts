import { useQuery } from "@tanstack/react-query";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { notificationModel } from "@/database/birthalert/notifications/model";
import { createNotificationCache } from "./cache";

const useGetNotificationsQuery = () => {
    return useQuery({
        queryKey: [NOTIFICATION_QUERY_KEY],
        queryFn: async () => {
            const res = await notificationModel.readAllRecords();
            const cache = createNotificationCache();
            for (const notification of res) {
                if (!notification.read) cache.not_read += 1;
                cache.filter.addItem(notification.group, notification);
            }
            return cache;
        },
        initialData: createNotificationCache(),
    })
};

export { useGetNotificationsQuery };