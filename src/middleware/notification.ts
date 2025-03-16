import { add_notifications_model, clear_notifications_model, del_notifications_model, upd_notifications_model } from "@/database/tables/notifications/db_model";
import { AppNotification } from "@/database/tables/notifications/notifications";

const add_notification_middleware = async (notification: AppNotification): Promise<AppNotification> => {
    try {
        const obj_notification = await add_notifications_model([notification]) as AppNotification;
        return obj_notification;
    } catch (e) {
        return Promise.reject(e);
    }
};

const upd_notification_middleware = async (notification: AppNotification): Promise<AppNotification> => {
    try {
        const obj_notification = await upd_notifications_model([notification]) as AppNotification;
        return Promise.resolve(obj_notification);
    } catch (e) {
        return Promise.reject(e);
    }
};

const del_notification_middleware = async (notification: AppNotification): Promise<number> => {
    try {
        await del_notifications_model([notification.id]);
        return notification.id;
    } catch (e) {
        return Promise.reject(e);
    }
};

const clear_notification_middleware = async () => {
    try {
        return await clear_notifications_model();
    } catch (e) {
        return Promise.reject(e);
    }
};

export {
    add_notification_middleware,
    upd_notification_middleware,
    del_notification_middleware,
    clear_notification_middleware,
};