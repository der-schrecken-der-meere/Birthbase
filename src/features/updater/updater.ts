import { check, DownloadEvent, Update } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"
import { Platform } from "@tauri-apps/plugin-os";
import { update_available, update_last_check, update_searching, use_update_store, update_version } from "@/hooks/use_update_store";
import type { VersionNumber } from "@/lib/types/number";
import { update_version as update_app_version } from "@/hooks/use_app_store";
import { getCurrentWindow, ProgressBarStatus } from "@tauri-apps/api/window";
import { create_toast, ToastType } from "@/hooks/use_app_toast";

/**
 * Triggers the progress event for UI related updates and
 * returns the new download size and amount of downloaded content.
 */
const handle_update_event = (type: DownloadEvent, download_size: number, downloaded: number) => {
    switch (type.event) {
        case "Started":
            use_update_store.getState().start_progress();
            return { download_size: type.data.contentLength as number, downloaded: 0, progress: 0 };
        case "Progress":
            const new_downloaded = downloaded + type.data.chunkLength;
            const progress = new_downloaded / download_size * 100;
            use_update_store.getState().update_progress(progress);
            return { download_size, downloaded: new_downloaded, progress };
        case "Finished":
            use_update_store.getState().finish_progress();
            return { download_size, downloaded: 100, progress: 100 };
    }
};

/**
 * Downloads the latest Update
 * 
 * This function should only be called on desktop applications
 * 
 * Notes: On Windows: the application will be restarted
 * 
 * @param restart Test
 * 
 */
const install_update = async (platform: Platform, restart: boolean = true) => {
    use_update_store.getState().start_progress();
    try {
        const update = await check() as Update;
        const window = getCurrentWindow();

        let n_download_size = 0;
        let n_downloaded = 0;

        await update.downloadAndInstall(async (event) => {
            const { downloaded, download_size, progress } = handle_update_event(event, n_download_size, n_downloaded);
            n_download_size = download_size;
            n_downloaded += downloaded;
            await window.setProgressBar({ progress: Math.floor(progress), status: ProgressBarStatus.Error });
        })

        const { version } = update;
        update_app_version(version as VersionNumber);

        // Clean up resource from memory
        update.close();

        // Due Windows Installer the application must be restarted or closed
        // after the update has been downloaded
        if (platform === "windows") {
            restart = true;
        }

        if (restart) {
            await relaunch();
            return;
        }
    } catch (e) {
        use_update_store.getState().finish_progress();
        create_toast({
            title: "Fehler beim installieren des Updates",
            description: "Die Verbindung zum Server wurde unterbrochen. Bitte überprüfen Sie ihre Netzwerkverbindung",
        }, ToastType.ERROR);
    }
    update_last_check();
    update_available(false);
};

const check_update = async () => {
    update_searching(true);
    update_available(false);
    use_update_store.getState().set_update_notes("");
    try {
        const update = await check({
            timeout: 10_000,
        });
        if (update) {
            const { version, body } = update;
            use_update_store.getState().set_update_notes(body ? body : "");
            update_version(version as VersionNumber);
            update_available(true);
        }
    } catch (e) {
        create_toast({
            title: "Fehler beim Suchen nach Updates",
            description: "Die Verbindung zum Server wurde unterbrochen. Bitte überprüfen Sie ihre Netzwerkverbindung",
        }, ToastType.ERROR);
    }
    update_searching(false);
    update_last_check();
};

export {
    install_update,
    handle_update_event,
    check_update,
};