// External features
import type { AppNotification } from "@/database/birthalert/notifications/types";
import type { DBRecord } from "@/types/db";
import { notificationModel } from "@/database/birthalert/notifications/model";
import { create_default_notification } from "@/database/birthalert/notifications/default";
import { DataOperation } from "@/lib/constants/enums/data_operation";

// Internal features
import type { CreateNotification } from "../../types/worker";
import { notificationSchedulerWorker } from "../../controller/controller";

class NotificationMiddleware {
    model: typeof notificationModel = notificationModel;
    
    constructor() {

    };

    async createNotifications(notifications: Partial<AppNotification>[]): Promise<(AppNotification & DBRecord)[]> {
        const mapped_notifications: AppNotification[] = notifications.map((notification) => {
            return {
                ...create_default_notification(),
                ...notification
            } as AppNotification;
        });
        const dbNotifications = await this.model.createRecords(mapped_notifications);
        notificationSchedulerWorker.send_message({
            tasks: dbNotifications.map(({ data, group, timestamp }) => {
                return {
                    action: DataOperation.CREATE,
                    new_data: {
                        data,
                        group,
                        timestamp,
                    }
                } as CreateNotification;
            }),
        });
        return dbNotifications;
    }

    async updateNotifications(notifications: (AppNotification & DBRecord)[]): Promise<(AppNotification & DBRecord)[]> {
        return this.model.updateRecords(notifications);
    }

    async deleteNotifications(notifications: number[]): Promise<(AppNotification & DBRecord)[]> {
        return Promise.all(notifications.map(async (notification) => {
            const old_notification = await this.model.readRecords([notification]);
            await this.model.deleteRecords([notification]);
            return old_notification[0];
        }));
    }

    async clearNotifications(): Promise<void> {
        return this.model.eraseTable();
    }
}

export { NotificationMiddleware };