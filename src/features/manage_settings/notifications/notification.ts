import { get_notification_permission, request_notification_permission } from "@/apis/tauri_notification";

const change_notification = async (notification_permission: boolean) => {
    const str_permission = await get_notification_permission();
    if (notification_permission) {
        if (str_permission === "default") {
            await request_notification_permission();
        }
    }
};

export { change_notification };