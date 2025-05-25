import { DBRecord } from "@/lib/types/db";
import { useAddNotificationQuery } from "../queries/notifications/use_add_notification";
import { useDeleteNotificationQuery } from "../queries/notifications/use_delete_notification";
import { useUpdateNotificationQuery } from "../queries/notifications/use_update_notification";
import { AppNotification } from "@/database/birthalert/notifications/types";
import { useQueryMutation } from "@/hooks/use_query_mutation";
import { UseQueryMutationOperations } from "@/hooks/types/use_query_mutation";

/** Mutation queries (add, update, delete) for notification */
const useNotificationMutation = ({
    deleteOptions,
    updateOptions,
    addOptions,
}: UseQueryMutationOperations = {}) => {
    // Hooks
    const { mutateAsync: deleteQuery } = useDeleteNotificationQuery();
    const { mutateAsync: updateQuery } = useUpdateNotificationQuery();
    const { mutateAsync: addQuery } = useAddNotificationQuery();

    const deleteNotificationOptions = useQueryMutation("notify.delete", deleteOptions);
    const updateNotificationOptions = useQueryMutation("notify.update", updateOptions);
    const addNotificationOptions = useQueryMutation("notify.add", addOptions);

    const deleteNotification = async (notification: AppNotification & DBRecord) => {
        await deleteQuery(notification, deleteNotificationOptions);
    };

    const updateNotification = async (notification: AppNotification & DBRecord) => {
        await updateQuery(notification, updateNotificationOptions);
    };

    const addNotification = async (notification: AppNotification) => {
        await addQuery(notification, addNotificationOptions);
    };

    return {
        deleteNotification,
        updateNotification,
        addNotification,
    };
};

export {
    useNotificationMutation
};