import { has_property } from "@/lib/functions/object/hasProperty";
import { type AppNotification } from "./notifications";
import { db, TABLES } from "@/database/db";

const add_notifications_model = async (notifications: AppNotification[]) => {
    // Remove the id from all notifications
    const arr_notifications: AppNotification[] = notifications.map((notification) => {
        if (has_property(notification, "id")) {
            // Dereference to prevent the change of the origin
            const obj_notification = { ...notification };
            /** @ts-ignore */
            delete obj_notification.id;
            return obj_notification;
        }
        return notification;
    });
    try {
        const res = await db.add(TABLES.NOTIFICATIONS, arr_notifications);
        if (res.length === 1) {
            return Promise.resolve(res[0]);
        }
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Remove multiple notifications
 */
const del_notifications_model = async (notification_ids: number[]) => {
    try {
        const res = await db.del(TABLES.NOTIFICATIONS, notification_ids);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Update multiple notifications
 */
const upd_notifications_model = async (notifications: AppNotification[]) => {
    try {
        const res = await db.upd(TABLES.NOTIFICATIONS, notifications);
        if (res.length === 1) {
            return Promise.resolve(res[0]);
        }
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Get a single notification
 */
const get_notification_model = (id: number) => {
    return db.get(TABLES.NOTIFICATIONS, id);
};

/**
 * Get all notifications
 */
const get_notifications_model = () => {
    return db.get(TABLES.NOTIFICATIONS);
};

const clear_notifications_model = () => {
    return db.clear(TABLES.NOTIFICATIONS);
};

export {
    add_notifications_model,
    del_notifications_model,
    upd_notifications_model,
    get_notification_model,
    get_notifications_model,
    clear_notifications_model,
};