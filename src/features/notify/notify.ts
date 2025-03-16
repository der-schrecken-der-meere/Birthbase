import { get_settings_model } from "@/database/tables/settings/db_model";
import { useToastStore, ToastType } from "@/stores/use_toast_store";
import { AddNotificationRequest, DelNotificationRequest, UpdNotificationRequest, type NotificationResponse } from "./core";
import { Errors } from "./errors";
import i18n from "@/i18n/config";
import { send_notifications } from "./communication/receiver";

// Variables
let obj_notification_worker: Worker | null = null;



// Functions
// Worker specific
const create_notification_worker = () => {
    return new Worker(new URL("./notification_worker", import.meta.url), {
        type: "module",
    });
};
const set_notification_worker = () => {
    if (!obj_notification_worker) {
        obj_notification_worker = create_notification_worker();
        obj_notification_worker.onmessage = on_message;
    }
};
const unset_notification_worker = () => {
    if (obj_notification_worker) {
        obj_notification_worker.terminate();
        obj_notification_worker = null;
    }
};

const send_message = (
    req: (AddNotificationRequest | DelNotificationRequest | UpdNotificationRequest)[]
) => {
    if (obj_notification_worker) {
        console.log("Sending Message to Worker:", req);
        obj_notification_worker.postMessage(req);
    }
};

const on_message = async (e: MessageEvent<NotificationResponse>) => {
    const res = e.data;
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
        await send_notifications(res.data, notification);
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
};

export {
    send_message,

    set_notification_worker,
    unset_notification_worker,
};