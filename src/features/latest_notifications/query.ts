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
    not_read: number,
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
    not_read: number = 0,
): NotificationFilterChache => {
    return {
        data,
        filters,
        not_read,
    };
};

const split_filter_array = (
    arr_filter: number[],
    index: number,
    map_factor: number
): [number[], number[]] => {
    const dc_arr_filter = [...arr_filter];
    const first_section = dc_arr_filter.slice(0, index + 1);
    const second_section = dc_arr_filter.slice(index + 1).map(index => index + map_factor);
    return [first_section, second_section];
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

            let not_read = 0;

            // Fill filters
            arr_sorted.forEach((notification, index) => {
                obj_filters[notification.type].push(index);
                if (!notification.read) not_read += 1;
            });

            return initialize_structure(arr_sorted, obj_filters, not_read);
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
        const { data, filters, not_read } = old_data;

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
            filters[notification.type] = [notification_index, ...filter_type.map(index => index + 1)];
        } else {
            // Index of the sorted array
            const sibbling_index = reversed_array.length - 1 - nearst_notification_index;

            // Position of the sibbling index
            const filter_index = filter_type.findIndex(n => n === sibbling_index);

            // Devide the array at the found position and
            // put the index of the new notification in between
            const [first_section, second_section] = split_filter_array(filter_type, filter_index, 1);
            filters[notification.type] = [...first_section, notification_index, ...second_section];
        }

        return initialize_structure(arr_sorted, filters, not_read + 1);
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
                const { data, filters, not_read } = old_data;
                const sorted_arr = upd_sorted_notifications(data, new_birthday);
                const factor = new_birthday.read ? -1 : 0;
                return initialize_structure(sorted_arr, filters, not_read + factor);
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
                const { data, filters, not_read } = old_data;

                const old_notification = data.find(notification => notification.id === notification_id);

                const notification_index = data.findIndex(notification => notification.id === notification_id);
                const sorted_arr = del_sorted_notifications(data, notification_id);

                if (notification_index !== -1) {

                    const notification_type = data[notification_index].type;
                    let arr_filter_indices = filters[notification_type];
                    const filter_index = arr_filter_indices.findIndex(index => index === notification_index);

                    if (filter_index !== -1) {
                        const [first_section, second_section] = split_filter_array(arr_filter_indices, filter_index, -1);
                        // Delete the first element (Index of the deleted notification)
                        second_section.shift();

                        filters[notification_type] = [...first_section, ...second_section];
                    }
                }

                const factor = old_notification?.read ? 0 : -1;

                return initialize_structure(sorted_arr, filters, not_read + factor);
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