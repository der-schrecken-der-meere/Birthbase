import { colors } from "@/globals/constants/colors";
import { CoreRecord } from "../db_types";
import { isTauri } from "@/globals/constants/environment";
import { isPermissionGranted } from "@tauri-apps/plugin-notification";

type Color = typeof colors[number];
type Mode = "dark"|"light"|"system";

interface Settings extends CoreRecord {
    mode: Mode;
    color: Color;
    permissions: {
        notification: NotificationPermission,
    };
    remember: number;
}

const getDefaultSettings = async (): Promise<Settings> => {
    return new Promise(async (resolve) => {
        let notificationPermission: PermissionState = "denied";
        try {
            if (isTauri) {
                const isGranted = await isPermissionGranted();
                if (isGranted) notificationPermission = "granted";
            } else {
                notificationPermission = (await navigator.permissions.query({ name: "notifications" })).state;
            }
        } catch (e) {
            console.error(e);
        }
        resolve({
            color: "purple",
            mode: "system",
            remember: 14,
            id: -1,
            permissions: {
                notification: notificationPermission === "prompt" ? "default" : notificationPermission,
            }
        });
    });
}

export type { Color, Mode, Settings }
export { getDefaultSettings }