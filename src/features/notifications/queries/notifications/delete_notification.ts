import { QueryClient } from "@tanstack/react-query";
import { NotificationQueueChache } from "../../types/query";
import { NOTIFICATION_QUERY_KEY } from "../../lib/constants/keys/notification_query";
import { createNotificationCache } from "./cache";
import { AppNotification } from "@/database/birthalert/notifications/types";
import { DBRecord } from "@/types/db";
import { binary_search } from "@/lib/functions/array/binary_search";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";

const deleteQueryClientNotification = (
    oldNotification: AppNotification & DBRecord,
    queryClient:  QueryClient,
    cb?: (arrayItem: AppNotification & DBRecord, oldItem: AppNotification & DBRecord) => number
) => {
    let notification: (AppNotification & DBRecord)|null = null;
    queryClient.setQueryData<NotificationQueueChache>(
        [NOTIFICATION_QUERY_KEY],
        (oldData) => {
            if (!oldData) return createNotificationCache();
            const { filter, not_read } = oldData;

            if (cb) {
                const filteredArray = filter.getFilter(oldNotification.group);
                if (filteredArray) {
                    const [index, found] = binary_search(filteredArray, oldNotification, (a, o) => {
                        const diff = a.id - o.id;
                        if (diff === 0 &&
                            (
                                a.group === NotificationGroup.BIRTHDAY ||
                                a.group === NotificationGroup.BIRTHDAY_REMINDER
                            )
                        ) {
                            /** @ts-ignore */
                            return a.data.id - o.data.id
                        }
                        return diff;
                    });
                    if (found) {
                        notification = filteredArray[index];
                    }
                }
            }
            filter.removeItem(oldNotification.group, oldNotification);

            return {
                not_read: not_read + (oldNotification.read ? 0 : -1),
                filter,
            }
        }
    );
    return notification;
};

export { deleteQueryClientNotification };