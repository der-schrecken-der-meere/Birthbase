import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { notificationModel } from "@/database/birthalert/notifications/model";
import { NotificationQueueChache } from "../../types/query";

const useGetNotificationQuery = (id: number) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [NOTIFICATION_QUERY_KEY, id],
        queryFn: async () => {
            const a = await notificationModel.readRecords([id]);
            return a[0];
        },
        initialData: () => {
            return queryClient
                .getQueryData<NotificationQueueChache>([NOTIFICATION_QUERY_KEY])
                ?.filter
                .array
                .get({ id })[0];
        },
    })
};

export { useGetNotificationQuery };