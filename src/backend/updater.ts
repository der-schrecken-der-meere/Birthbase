import { AppDispatch } from "@/store/store";
import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"
import { startDownload, updateProgress, finishDownload } from "@/store/update/updateSlice";

const installUpdate = async (dispatch: AppDispatch) => {
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

    console.log("Update installiert");
    await relaunch();
}

export { installUpdate };