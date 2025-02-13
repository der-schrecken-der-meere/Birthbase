import { update_os_type, update_tauri_version, update_version } from "@/hooks/use_app_store";
import { VersionNumber } from "@/lib/types/number";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/plugin-os";

const init_tauri = async () => {
    const app_version = await getVersion();
    update_version(app_version as VersionNumber);

    const tauri_version = await getTauriVersion();
    update_tauri_version(tauri_version as VersionNumber);

    const os_type = type();
    update_os_type(os_type);
};

export { init_tauri };