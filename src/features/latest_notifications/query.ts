import { get_notification_model, get_notifications_model } from "@/database/tables/notifications/db_model";
import { add_sorted_notifications, del_sorted_notifications, get_sorted_notifications, upd_sorted_notifications } from "./sort";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/database/tables/notifications/notifications";
import { add_notification_middleware, del_notification_middleware, upd_notification_middleware } from "@/middleware/notification";

// Constants
const c_query_key = "notifications";



// Functions
const get_notifications_query = () => {
    return useQuery({
        queryKey: [c_query_key],
        queryFn: async () => {
            const res = await get_notifications_model();
            return get_sorted_notifications(res);
        },
        initialData: [],
    });
};

const get_notification_query = (id: number) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [c_query_key, id],
        queryFn: () => {
            return get_notification_model(id);
        },
        initialData: () => {
            return queryClient.getQueryData<Notification[]>([c_query_key])?.find(notification => notification.id === +id);
        },
    });
};

const add_notification_query_client = (data: Notification, queryClient: QueryClient) => {
    queryClient.setQueryData<Notification[]>([c_query_key], (oldData) => {
        if (!oldData) return [data];
        return add_sorted_notifications(oldData, data);
    });
};

const add_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notification: Notification) => {
            return add_notification_middleware(notification) as Promise<Notification>;
        },
        onSuccess: (data) => {
            return add_notification_query_client(data, queryClient);
        },
    });
};

const upd_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notification: Notification)=> {
            return upd_notification_middleware(notification) as Promise<Notification>;
        },
        onSuccess: (newBirthday) => {
            queryClient.setQueryData<Notification[]>([c_query_key], (oldData) => {
                if (!oldData) return [newBirthday];
                return upd_sorted_notifications(oldData, newBirthday);
            });
        }
    });
};

const del_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notification: Notification) => {
            return del_notification_middleware(notification);
        },
        onSuccess: (deletedBirthdayIndex) => {
            queryClient.setQueryData<Notification[]>([c_query_key], (oldData) => {
                if (!oldData) return [];
                return del_sorted_notifications(oldData, deletedBirthdayIndex);
            });
        }
    });
};

export {
    get_notification_query,
    get_notifications_query,
    add_notification_query,
    add_notification_query_client,
    upd_notification_query,
    del_notification_query,
};