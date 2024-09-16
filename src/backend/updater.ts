import { AppDispatch, RootState } from "@/frontend/store/store";
import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"
import { startDownload, updateProgress, finishDownload } from "@/frontend/store/update/updateSlice";
import { UseSelector } from "react-redux";

/**
 * Downloads the latest Update
 * 
 * Notes: On Windows: the application will be restarted
 */
const installUpdate = async (dispatch: AppDispatch, selector: UseSelector) => {
    const platform = selector((state: RootState) => state.tauri.appInfo.platform);

    const update = await check();
    await update?.downloadAndInstall((event) => {
        switch (event.event) {
            case "Started":
                dispatch(startDownload(event.data.contentLength as number));
                break;
            case "Progress":
                dispatch(updateProgress(event.data.chunkLength));
                break;
            case "Finished":
                dispatch(finishDownload());
                break;
            default:
                break;
        }
    })

    // Due Windows Installer the application must be restarted or closed
    // after the update has been downloaded
    if (platform === "windows") {
        await relaunch();
    }
}

export { installUpdate };