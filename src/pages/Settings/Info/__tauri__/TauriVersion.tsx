import { NavigationEntryCore } from "@/components/settings/core/NavigationEntryCore";
import { useAppStore } from "@/stores/use_app_store";
import { useTranslation } from "react-i18next";

const TauriVersion = () => {
    const tauriVersion = useAppStore((state) => state.tauriVersion);
    const { t } = useTranslation(["pages"]);

    return (
        <NavigationEntryCore
            caption={t("settings_info.tauri_version_description")}
            actionNode={`v${tauriVersion}`}
        >
            {t("settings_info.tauri_version_title")}
        </NavigationEntryCore>
    );
};

export { TauriVersion };