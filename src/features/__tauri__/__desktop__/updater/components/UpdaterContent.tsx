// Packages
import { useEffect } from "react";

// External features
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSettingsQuery } from "@/features/settings/query";
import { useErrorQuery } from "@/hooks/core/use_query";

// Interal features
import { useUpdateStore } from "../stores/use_update";
import { UpdaterProgress } from "./UpdaterProgress";
import { useTranslation } from "react-i18next";

let UpdaterRestartCheckbox = null;
if (__TAURI_IS_LINUX__ || __TAURI_IS_MAC__) {
    UpdaterRestartCheckbox = await import("./__linux__macos__/UpdaterRestartCheckbox").then(module => module.UpdaterRestartCheckbox);
}

const UpdateContent = () => {

    const isDownloading = useUpdateStore((state) => state.isDownloading);
    const update_version = useUpdateStore((state) => state.version);
    const setShouldRestart = useUpdateStore((state) => state.setShouldRestart);

    const { t } = useTranslation(["updater", "generally"]);
    const { data: { relaunch }, isFetching } = useErrorQuery({
        useQueryFn: useGetSettingsQuery,
        tKey: "settings",
    });

    useEffect(() => {
        setShouldRestart(relaunch);
    }, []);

    if (isFetching) {
        return (
            <Skeleton className='w-full h-10'/>
        );
    }

    return (
        <>
            {isDownloading
                ? <UpdaterProgress/>
                : (UpdaterRestartCheckbox && (
                    <UpdaterRestartCheckbox>
                        {t("restart_app")}
                    </UpdaterRestartCheckbox>
                ))
            }
        </>
    );
};

export { UpdateContent };