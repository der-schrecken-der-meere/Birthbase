import { add_sorted_array_ref } from "@/lib/functions/array/sort";

type ID = { id: number };

type MessageQueueType<T, N> = {
    type: T,
    notifications: (ID & N)[],
};

type MessageQueueItem<T, N> = {
    timestamp: number,
    types: MessageQueueType<T, N>[],
};

class NotificationQueue<T, N> {

    queue: MessageQueueItem<T, N>[];

    constructor () {
        this.queue = [];
    }

    /**
     * Returns a reference to the created `MessageQueueItem`.
     */
    add_item(timestamp: number): MessageQueueItem<T, N> {
        const mq_item_ref = add_sorted_array_ref(
            this.queue,
            {
                timestamp,
                types: [],
            },
            (mq_item) => mq_item.timestamp >= timestamp
        );
        return mq_item_ref;
    }

    /**
     * Returns a reference to the created `MessageQueueType`.
     */
    add_type(type: T, mq_item_ref: MessageQueueItem<T, N>) {
        const mq_type_ref = add_sorted_array_ref(
            mq_item_ref.types,
            {
                type,
                notifications: [],
            },
            (mq_type) => mq_type.type === type, 
        );
        return mq_type_ref;
    }

    /**
     * Adds the notification to the queue
     */
    add_notification(timestamp: number, type: T, notification: ID & N) {
        let mq_item = this.queue[this.find_item(timestamp)];
        if (!mq_item) {
            mq_item = this.add_item(timestamp);
        }
        let mq_type = mq_item.types[this.find_type(type, mq_item)];
        if (!mq_type) {
            mq_type = this.add_type(type, mq_item);
        }
        const mq_notification_index = this.find_notification(notification.id, mq_type);
        if (mq_notification_index === -1) {
            mq_type.notifications.push(notification);
            return;
        }
        mq_type.notifications[mq_notification_index] = notification;
    }

    /**
     * Checks if `MessageQueueItem.types` or `MessageQueueType.notifications` is empty
     */
    check_empty(mq_item_index: number, mq_type_index: number) {
        const mq_item = this.queue[mq_item_index];
        if (!mq_item) {
            return;
        }
        const mq_type = mq_item.types[mq_type_index];
        if (!mq_type) {
            return;
        }
        if (mq_type.notifications.length === 0) {
            mq_item.types.splice(mq_type_index, 1);
        }
        if (mq_item.types.length === 0) {
            this.queue.splice(mq_item_index, 1);
        }
    }

    /**
     * Deletes the notification from the queue
     */
    del_notification(timestamp: number, type: T, notification: ID & N) {
        const [item_index, type_index, notification_index] = this.find_notification_index(
            timestamp,
            type,
            notification.id
        );
        if (
            (item_index !== null) && 
            (type_index !== null)
        ) {
            if (notification_index !== null) {
                this.queue[item_index].types[type_index].notifications.splice(notification_index, 1);
            }
            this.check_empty(item_index, type_index);
        }
    }

    /**
     * Updates a given notification in the queue. Perhaps changes the location of the notification.
     */
    upd_notification(old_timestamp: number, new_timestamp: number, old_type: T, new_type: T, notification: ID & N) {
        this.add_notification(new_timestamp, new_type, notification);
        this.del_notification(old_timestamp, old_type, notification);
    }

    find_notification_index(timestamp: number, type: T, notification_id: number): [number | null, number | null, number | null] {
        const mq_item_index = this.find_item(timestamp)
        let mq_item = this.queue[mq_item_index];
        if (!mq_item) {
            return [null, null, null];
        }
        const mq_type_index = this.find_type(type, mq_item);
        let mq_type = mq_item.types[mq_type_index];
        if (!mq_type) {
            return [mq_item_index, null, null];
        }
        const mq_notification_index = this.find_notification(notification_id, mq_type);
        if (mq_notification_index === -1) {
            return [mq_item_index, mq_type_index, null];
        }
        return [mq_item_index, mq_type_index, mq_notification_index];
    }

    /**
     * Returns the index of `MessageQueueItem` where timestamp is equal.
     */
    find_item(timestamp: number) {
        return this.queue.findIndex((queue_item) => queue_item.timestamp === timestamp);
    }

    /**
     * Returns the index of `MessageQueueType` where the type is equal.
     * 
     * @param type Notification type
     * @param mq_item_ref Reference of the `MessageQueueItem` to search in
     */
    find_type(type: T, mq_item_ref: MessageQueueItem<T, N>) {
        return mq_item_ref.types.findIndex((mq_type) => mq_type.type === type);
    }

    /**
     * Returns the index of `ID` where the ID is equal.
     * 
     * @param id Notification id
     * @param mq_type_ref Reference of the `MessageQueueType` to search in
     */
    find_notification(id: number, mq_type_ref: MessageQueueType<T, N>) {
        return mq_type_ref.notifications.findIndex((notification) => notification.id === id);
    }

    /**
     * Returns a deep clone of `MessageQueueItem`
     */
    get_item(index: number) {
        return structuredClone(this.queue[index]);
    }

    del_item_copy(index: number) {
        const copy = this.get_item(index);
        this.queue.splice(index, 1);
        return copy;
    }

    /**
     * Returns the number of items in the queue
     */
    get_length() {
        return this.queue.length;
    }
}

export type { MessageQueueType, MessageQueueItem, ID };
export { NotificationQueue };