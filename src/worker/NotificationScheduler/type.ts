import { AppNotificationProps } from "@/database/tables/notifications/notifications";
import { AddNotificationRequest, DelNotificationRequest, UpdNotificationRequest } from "@/features/notify/core";

type Request = {
    code?: "port",
    tasks?: (AddNotificationRequest|UpdNotificationRequest|DelNotificationRequest)[],
};

type Response = {
    error?: string,
    data?: AppNotificationProps[],
}

export type { Request, Response };