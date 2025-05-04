import type { Request, Response } from "./type";

import { WorkerController } from "@/lib/util/classes/WorkerController";

import { ToastType, useToastStore } from "@/stores/use_toast_store";
import { get_settings_model } from "@/database/tables/settings/db_model";
import { send_notifications } from "@/features/notify/communication/receiver";
import { Errors } from "@/features/notify/errors";
import i18n from "@/i18n/config";
import Worker from "./worker?worker";

const NotificationSchedulerWorker = new WorkerController<Request, Response>(
    () => new Worker({ name: "NotificationSchedulerWorker" }),
    async (ev) => {
        console.log("NotificationSchedulerWorker Response: ", ev.data);

        const res = ev.data;
        console.log(res)
        const setToast = useToastStore.getState().setToast;
        const { t } = i18n;
    
        if (res.error) {
            setToast({
                title: t("errors.notify.title", { ns: "toast" }),
                description: t(`errors.notify.descriptions.${res.error}`, { ns: "toast" }),
            }, ToastType.ERROR);
            return;
        }
    
        const { notification } = await get_settings_model();
        try {
            await send_notifications(res.data as any, notification);
        } catch (e) {
            let error = Errors.RUN;
            if (e === "denied") {
                error = Errors.NO_RIGHT;
            }
            setToast({
                title: t("errors.notify.title", { ns: "toast" }),
                description: t(`errors.notify.descriptions.${error}`, { ns: "toast" }),
            }, ToastType.ERROR);
        }
    },
    (ev) => {
        console.error("NotificationSchedulerWorker Error: ", ev);
    },
);

export { NotificationSchedulerWorker };