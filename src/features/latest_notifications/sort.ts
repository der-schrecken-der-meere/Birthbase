import { Notification } from "@/database/tables/notifications/notifications";
import { add_sorted_array, del_sorted_array, upd_sorted_array } from "@/lib/functions/array/sort";

/**
 * Sorts a array of notifications by timestamp
 */
const get_sorted_notifications = (array: Notification[]) => {
    return array.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });
};

/**
 * Adds a new notification to a sorted array
 */
const add_sorted_notifications = (sortedArray: Notification[], notification: Notification) => {
    return add_sorted_array(sortedArray, notification, (v) => notification.timestamp <= v.timestamp);
};

/**
 * Updates a notification in a sorted array
 * 
 * Perhaps change the position of the updated notification in the sorted array
 */
const upd_sorted_notifications = (sortedArray: Notification[], newNotification: Notification) => {
    const oldNotificationIndex = sortedArray.findIndex((oldNotification) => oldNotification.id === newNotification.id);
    if (oldNotificationIndex === -1) {
        return add_sorted_notifications(sortedArray, newNotification);
    }
    if (sortedArray[oldNotificationIndex].timestamp === newNotification.timestamp) {
        const cpySortedArray = [...sortedArray];
        cpySortedArray[oldNotificationIndex] = newNotification;
        return cpySortedArray;
    }
    return upd_sorted_array(sortedArray, oldNotificationIndex, newNotification, (v) => newNotification.timestamp <= v.timestamp);
};

/**
 * Deletes a notification in a sorted array
 */
const del_sorted_notifications = (sortedArray: Notification[], notificationID: number) => {
    return del_sorted_array(sortedArray, (v) => v.id === notificationID);
};

export {
    get_sorted_notifications,
    add_sorted_notifications,
    upd_sorted_notifications,
    del_sorted_notifications
};