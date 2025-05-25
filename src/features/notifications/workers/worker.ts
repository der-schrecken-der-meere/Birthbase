// External feautures
import type { AppNotificationData } from "@/database/birthalert/notifications/types";
import { TimeQueue } from "@/lib/classes/TimeQueue";
import { WorkerWrapper } from "@/lib/classes/WorkerWrapper";
import { DataOperation } from "@/lib/constants/enums/data_operation";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";

// Internal features
import type { CreateNotification, DeleteNotification, UpdateNotification, WorkerRequest, WorkerResponse } from "../types/worker";
import { NotificationError } from "../lib/constants/enums/error";

const wrapper = new WorkerWrapper<WorkerRequest, WorkerResponse>(function(a) {
    for (const task of a.tasks) {
        switch (task.action) {
            case DataOperation.CREATE:
                add_item(task);
                break;
            case DataOperation.DELETE:
                del_item(task);
                break;
            case DataOperation.UPDATE:
                upd_item(task);
                break;
            default:
                this.postError(NotificationError.UNKNOWN_TASK);
                break;
        }
    }
});

const timeQueue = new TimeQueue<AppNotificationData>(({ data, timestamp }) => {
    if (wrapper.port) {
        wrapper.postMessage({ data: data, timestamp });
    }
});

const idCallback = (queueItem: AppNotificationData, chunkItem: Partial<AppNotificationData>): boolean => {
    if (
        chunkItem.group === NotificationGroup.BIRTHDAY &&
        queueItem.group === NotificationGroup.BIRTHDAY
    ) {
        return chunkItem?.data?.id === queueItem.data.id;
    }

    if (
        chunkItem.group === NotificationGroup.BIRTHDAY_REMINDER &&
        queueItem.group === NotificationGroup.BIRTHDAY_REMINDER
    ) {
        return chunkItem?.data?.id === queueItem.data.id;
    }

    if (
        chunkItem.group === NotificationGroup.INFO &&
        queueItem.group === NotificationGroup.INFO
    ) {
        return (
            chunkItem?.data?.version === queueItem.data.version &&
            chunkItem?.data?.type === queueItem.data.type
        );
    }

    return false;
};

const add_item = ({
    new_data: {
        timestamp,
        ...props
    }
}: CreateNotification) => {
    timeQueue.add_data([{
        timestamp,
        data: [{
            ...props
        }],
    }]);
};
const del_item = ({
    old_data: {
        timestamp,
        ...props
    }
}: DeleteNotification) => {
    if (props.data && props.group) {
        timeQueue.remove_data(
            [
                {
                    timestamp,
                    data: [{
                        ...(props as any)
                    }],
                }
            ],
            idCallback
        );
        return;
    }
    timeQueue.remove_timestamp([timestamp]);
};
const upd_item = ({
    old_data: {
        timestamp: old_timestamp,
        ...old_props
    },
    new_data: {
        timestamp: new_timestamp,
        ...new_props
    }
}: UpdateNotification) => {
    if ((old_timestamp !== new_timestamp) && new_timestamp != undefined) {
        timeQueue.update_timestamp([{
            new_timestamp,
            old_timestamp
        }])
    }
    if (new_props.data && new_props.group) {
        timeQueue.update_data(
            [{
                timestamp: old_timestamp,
                data: [{
                    new_item: new_props,
                    old_item: old_props
                }]
            }],
            idCallback
        );
    }
};

// Logging
// setInterval(() => {
//     console.log(timeQueue.queue);
// }, 100);