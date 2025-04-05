import { get_settings_model } from "@/database/tables/settings/db_model";
import { useToastStore, ToastType } from "@/stores/use_toast_store";
import { Errors } from "./errors";
import i18n from "@/i18n/config";
import { send_notifications } from "./communication/receiver";
import { NotificationResponse } from "./core";

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
    on_message,
};