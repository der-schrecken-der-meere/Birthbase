import { AppNotification } from "@/database/birthalert/notifications/types";
import { DBRecord } from "@/types/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationMiddleware } from "../../lib/instances/middleware";
import { deleteQueryClientNotification } from "./delete_notification";

const useDeleteNotificationQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notification: AppNotification & DBRecord) => {
            const res = await notificationMiddleware.deleteNotifications([notification.id]);
            return res[0];
        },
        onSuccess: (oldNotification) => {
            deleteQueryClientNotification(oldNotification, queryClient);
        }
    });
};

export { useDeleteNotificationQuery };