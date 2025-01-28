import { add_notifications_model, del_notifications_model, upd_notifications_model } from "@/database/tables/notifications/db_model";
import { Notification } from "@/database/tables/notifications/notifications";

const add_notification_middleware = async (notification: Notification): Promise<Notification> => {
    try {
        const obj_notification = await add_notifications_model([notification]) as Notification;
        return obj_notification;
    } catch (e) {
        return Promise.reject(e);
    }
};

const upd_notification_middleware = async (notification: Notification): Promise<Notification> => {
    try {
        const obj_notification = await upd_notifications_model([notification]) as Notification;
        return Promise.resolve(obj_notification);
    } catch (e) {
        return Promise.reject(e);
    }
};

const del_notification_middleware = async (notification: Notification): Promise<number> => {
    try {
        await del_notifications_model([notification.id]);
        return notification.id;
    } catch (e) {
        return Promise.reject(e);
    }
};

export {
    add_notification_middleware,
    upd_notification_middleware,
    del_notification_middleware,
};