// External features
import type { AppNotification } from "@/database/birthalert/notifications/types";
import { create_default_notification } from "@/database/birthalert/notifications/default";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { settingsModel } from "@/database/birthalert/settings/model";
import { WorkerController } from "@/lib/classes/WorkerController";
import { queryClient } from "@/lib/instances/query_client";
import { useToastStore } from "@/stores/appToast/store";
import { AppToastType } from "@/stores/appToast/lib/enum/type";
import i18n from "@/i18n/load";

// Internal features
import { notificationModel } from "@/database/birthalert/notifications/model";
import type { PreparedNotification } from "../types/prepare";
import type { WorkerRequest, WorkerResponse } from "../types/worker";
import { NotificationError } from "../lib/constants/enums/error";
import { send_notification } from "../lib/fn/send_notification";
import { prepare_birthday_notification } from "./tasks/prepare/birthday";
import { prepare_birthday_reminder_notification } from "./tasks/prepare/birthday_reminder";
import { prepare_info_notification } from "./tasks/prepare/info";
import { addQueryClientNotification } from "../queries/notifications/add_notification";
import Worker from "../workers/worker?worker";

const notificationSchedulerWorker = new WorkerController<WorkerRequest, WorkerResponse>(
    () => new Worker({ name: "NotificationSchedulerWorker" }),
    async ({ data, timestamp }) => {
        const { notification: allowed } = (await settingsModel.readAllRecords())[0];
        console.log(allowed, data, timestamp)
        try {
            if (data && timestamp) {
                const { t } = i18n;

                const notificationPart: Pick<AppNotification, "read"|"timestamp"> = {
                    timestamp,
                    read: false,
                };

                for (const notificationData of data) {
                    let notification_options: PreparedNotification|null = null;

                    const dbNotification = (await notificationModel.createRecords([{ ...notificationData, ...notificationPart }]))[0];
                    
                    switch (notificationData.group) {
                        case NotificationGroup.BIRTHDAY:
                            notification_options = await prepare_birthday_notification(
                                dbNotification as any,
                                t,
                            );
                            break;
                        case NotificationGroup.BIRTHDAY_REMINDER:
                            notification_options = await prepare_birthday_reminder_notification(
                                dbNotification as any,
                                t,
                            );
                            break;
                        case NotificationGroup.INFO:
                            notification_options = await prepare_info_notification(
                                dbNotification as any,
                                t,
                            );
                            break;
                        default:
                            break;
                    }

                    if (!notification_options) continue;
                    const { notification, options } = notification_options;

                    addQueryClientNotification(
                        {...create_default_notification(), ...notification},
                        queryClient
                    );

                    if (!allowed) continue;
                    await send_notification(options);
                }
            }
        } catch (e) {
            console.error(e);
            let error = e as NotificationError;
            if (e === "denied") {
                error = NotificationError.NO_RIGHT;
            }
            const { t } = i18n;
            useToastStore.getState().setToast({
                title: t("error", { ns: "generally" }),
                description: t(error, { ns: "error" }),
            }, AppToastType.ERROR);
        }
    },
    (ev) => {
        console.error("NotificationSchedulerWorker Error: ", ev);
    },
);

export { notificationSchedulerWorker };