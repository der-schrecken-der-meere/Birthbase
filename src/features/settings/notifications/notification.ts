import { get_notification_permission } from "@/apis/notification/get_notification_perm";
import { request_notification_permission } from "@/apis/notification/req_notification_perm";

const change_notification = async (notification_permission: boolean) => {
    const str_permission = await get_notification_permission();
    if (notification_permission) {
        if (str_permission === "default") {
            await request_notification_permission();
        }
    }
};

export { change_notification };