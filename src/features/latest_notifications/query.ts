import { get_notification_model, get_notifications_model } from "@/database/tables/notifications/db_model";
import { add_sorted_notifications, del_sorted_notifications, get_sorted_notifications, upd_sorted_notifications } from "./sort";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/database/tables/notifications/notifications";
import { add_notification_middleware, clear_notification_middleware, del_notification_middleware, upd_notification_middleware } from "@/middleware/notification";
import { NotificationType } from "../notify/notify";

type NotificationFilter = {
    [k: number]: number[],
};

type NotificationFilterChache = {
    data: Notification[],
    filters: NotificationFilter,
};

// Constants
const c_query_key = "notifications";



// Functions
const initialize_filters = (): NotificationFilter => {
    const obj_filters: {[k: number]: number[]} = {};
    for (const filter in NotificationType) {
        if (isNaN(+filter)) {
            continue;
        }
        obj_filters[filter as any as number] = [];
    }
    return obj_filters;
};

const initialize_structure = (
    data: Notification[] = [],
    filters: NotificationFilter = initialize_filters(),
): NotificationFilterChache => {
    return {
        data,
        filters,
    };
};

const get_notifications_query = () => {
    return useQuery({
        queryKey: [c_query_key],
        queryFn: async () => {
            const res = await get_notifications_model();
            
            // Initialize filters
            const obj_filters = initialize_filters();

            // Sort notifications
            const arr_sorted = get_sorted_notifications(res);

            // Fill filters
            arr_sorted.forEach((notification, index) => {
                obj_filters[notification.type].push(index);
            });

            return initialize_structure(arr_sorted, obj_filters);
        },
        initialData: initialize_structure(),
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
            return queryClient.getQueryData<NotificationFilterChache>([c_query_key])?.data.find(notification => notification.id === +id);
        },
    });
};

const add_notification_query_client = (notification: Notification, queryClient: QueryClient) => {
    queryClient.setQueryData<NotificationFilterChache>([c_query_key], (old_data) => {
        if (!old_data) return initialize_structure([notification]);
        const { data, filters } = old_data;

        const arr_sorted = add_sorted_notifications(data, notification);

        // Find index of inserted array
        const notification_index = arr_sorted.findIndex(n => n.id === notification.id);

        // Get the part of the array before the inserted notification
        // and reverse it to find the first (closest) type sibbling
        const reversed_array = arr_sorted.slice(0, notification_index).reverse();
        const nearst_notification_index = reversed_array.findIndex(n => n.type === notification.type);


        let filter_type = filters[notification.type];
        if (nearst_notification_index === -1) {
            // No type sibbling was found, so just push into the array
            filter_type.push(notification_index);
        } else {
            // Index of the sorted array
            const sibbling_index = reversed_array.length - 1 - nearst_notification_index;
            // Position of the sibbling index
            const filter_index = filter_type.findIndex(n => n === sibbling_index);
            // Devide the array at the found position and
            // put the index of the new notification in between
            const first_section = filter_type.slice(0, filter_index + 1);
            const second_section = filter_type.slice(filter_index + 1).map(index => index + 1);
            filter_type = [...first_section, notification_index, ...second_section];
        }

        return initialize_structure(arr_sorted, filters);
    });
};

const add_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notification: Notification) => {
            return add_notification_middleware(notification);
        },
        onSuccess: (notification) => {
            return add_notification_query_client(notification, queryClient);
        },
    });
};

const upd_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notification: Notification)=> {
            return upd_notification_middleware(notification);
        },
        onSuccess: (new_birthday) => {
            queryClient.setQueryData<NotificationFilterChache>([c_query_key], (old_data) => {
                if (!old_data) return initialize_structure([new_birthday]);
                const { data, filters } = old_data;
                const sorted_arr = upd_sorted_notifications(data, new_birthday);
                return initialize_structure(sorted_arr, filters);
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
        onSuccess: (notification_id) => {
            queryClient.setQueryData<NotificationFilterChache>([c_query_key], (old_data) => {
                if (!old_data) return initialize_structure();
                const { data, filters } = old_data;
                const index = data.findIndex(notification => notification.id === notification_id);
                const sorted_arr = del_sorted_notifications(data, notification_id);
                if (index !== -1) {
                    let arr_filter_indices = filters[data[index].type];
                    const filter_index = arr_filter_indices.findIndex(notification_index => notification_index === index);
                    if (filter_index !== -1) {
                        let arr_parts = arr_filter_indices.slice(filter_index + 1);
                        arr_parts = arr_parts.map(index => index - 1);
                        arr_filter_indices.splice(filter_index, 1);
                        arr_filter_indices = [...arr_filter_indices, ...arr_parts];
                    }
                }
                return initialize_structure(sorted_arr, filters);
            });
        }
    });
};

const clear_notification_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await clear_notification_middleware();
        },
        onSuccess: () => {
            queryClient.setQueryData<NotificationFilterChache>([c_query_key], () => initialize_structure());
        }
    })
};

export {
    get_notification_query,
    get_notifications_query,
    add_notification_query,
    add_notification_query_client,
    upd_notification_query,
    del_notification_query,
    clear_notification_query,
};