import {
    useAddNotificationQuery,
    useDelNotificationQuery,
    useUpdNotificationQuery,
} from "@/features/latest_notifications/query";
import { useMutation, UseMutationProps, UseMutationReturn } from "./core/use_mutation";
import { Notification } from "@/database/tables/notifications/notifications";

const useNotificationMutation = ({
    del_cbs,
    upd_cbs,
    add_cbs
}: UseMutationProps): UseMutationReturn<Notification> => {
    const { mutateAsync: del_query } = useDelNotificationQuery();
    const { mutateAsync: upd_query } = useUpdNotificationQuery();
    const { mutateAsync: add_query } = useAddNotificationQuery();

    const { mutation_options } = useMutation();

    const del = async (notification: Notification) => {
        await del_query(notification, mutation_options(
            "delete",
            "notification",
            del_cbs
        ));
    };

    const upd = async (notification: Notification) => {
        await upd_query(notification, mutation_options(
            "update",
            "notification",
            upd_cbs
        ));
    };

    const add = async (notification: Notification) => {
        await add_query(notification, mutation_options(
            "add",
            "notification",
            add_cbs
        ));
    };

    return {
        del,
        upd,
        add
    };
};

export {
    useNotificationMutation
};