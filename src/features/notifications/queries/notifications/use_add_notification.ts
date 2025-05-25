import { AppNotification } from "@/database/birthalert/notifications/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationMiddleware } from "../../lib/instances/middleware";
import { addQueryClientNotification } from "./add_notification";

const useAddNotificationQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notification: AppNotification) => {
            const res = await notificationMiddleware.createNotifications([notification]);
            return res[0];
        },
        onSuccess: (notification) => {
            addQueryClientNotification(notification, queryClient);
        },
    });
};

export { useAddNotificationQuery };