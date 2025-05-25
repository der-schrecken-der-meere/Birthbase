import type { VersionNumber } from "@/lib/types/number";

import { useAppStore } from "@/stores/use_app_store";
// import { useUpdateStore } from "@/stores/use_update_store";
import { ToastType, useToastStore } from "@/stores/use_toast_store";

import { getCurrentWindow, ProgressBarStatus } from "@tauri-apps/api/window";
import { relaunch } from "@tauri-apps/plugin-process";
import { check, Update, type DownloadEvent } from "@tauri-apps/plugin-updater";
import i18n from "@/i18n/load";
import { useUpdateStore } from "../../stores/use_update";

/**
 * Triggers the progress event for UI related updates and
 * returns the new download size and amount of downloaded content.
 * 
 * @param download_size Size of the download
 * @param downloaded Amount of downloaded content
 */
const handle_update_event = (type: DownloadEvent, download_size: number, downloaded: number) => {
    const setProgress = useUpdateStore.getState().setProgress;
    const setStartProgress = useUpdateStore.getState().setStartProgress;
    const setFinishProgress = useUpdateStore.getState().setFinishProgress;

    switch (type.event) {
        case "Started":
            setStartProgress();
            return { download_size: type.data.contentLength as number, downloaded: 0, progress: 0 };
        case "Progress":
            const new_downloaded = downloaded + type.data.chunkLength;
            const progress = new_downloaded / download_size * 100;
            setProgress(progress);
            return { download_size, downloaded: new_downloaded, progress };
        case "Finished":
            setFinishProgress();
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
 * @param restart Wether the application should be restarted after the update has been downloaded
 * 
 */
const install_update = async () => {
    const setStartProgress = useUpdateStore.getState().setStartProgress;
    const setFinishProgress = useUpdateStore.getState().setFinishProgress;
    const setLastCheck = useUpdateStore.getState().setLastCheck;
    const setAvailable = useUpdateStore.getState().setAvailable;

    const setAppVersion = useAppStore.getState().setAppVersion;

    const setToast = useToastStore.getState().setToast;

    setStartProgress();
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
        });

        const { version } = update;
        setAppVersion(version as VersionNumber);

        // Clean up resource from memory
        update.close();

        // Due to Windows Installer the application must be restarted or closed
        // after the update has been downloaded
        if (__TAURI_IS_WINDOWS__ || useUpdateStore.getState().shouldRestart) {
            await relaunch();
            return;
        }
    } catch (e) {
        setToast({
            title: i18n.t("errors.install_update.title", { ns: "toast" }),
            description: i18n.t("errors.install_update.description", { ns: "toast" }),
        }, ToastType.ERROR);
    }
    setFinishProgress();
    setLastCheck();
    setAvailable(false);
};

export { install_update };