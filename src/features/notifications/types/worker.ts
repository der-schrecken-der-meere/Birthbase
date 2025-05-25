import type { AppNotificationData } from "@/database/birthalert/notifications/types";
import { type DataOperation } from "@/lib/constants/enums/data_operation";
import { type NotificationGroup } from "@/database/birthalert/notifications/enums/group";

type NotificationProps = AppNotificationData & {
    group: NotificationGroup,
};

type NotificatioTimestamp = { timestamp: number };

type NotificationNewData = Partial<NotificationProps> & Partial<NotificatioTimestamp>;
type NotificationOldData = Partial<NotificationProps> & NotificatioTimestamp;

type CreateNotification = {
    action: DataOperation.CREATE,
    new_data: NotificationProps & NotificatioTimestamp,
};

type UpdateNotification = {
    action: DataOperation.UPDATE,
    old_data: NotificationOldData,
    new_data: NotificationNewData,
};

type DeleteNotification = {
    action: DataOperation.DELETE,
    old_data: NotificationOldData,
};

type WorkerRequest = {
    tasks: (CreateNotification|UpdateNotification|DeleteNotification)[],
};

type WorkerResponse = {
    error?: string,
    data?: AppNotificationData[],
    timestamp?: number,
};

export type {
    NotificationNewData,
    CreateNotification,
    UpdateNotification,
    DeleteNotification,
    WorkerRequest,
    WorkerResponse,
};