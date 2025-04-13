import { NavigationEntryCore } from "@/components/settings/core/NavigationEntryCore";
import { useAppStore } from "@/stores/use_app_store";
import { useTranslation } from "react-i18next";

const Version = () => {
    const appVersion = useAppStore((state) => state.appVersion);
    const { t } = useTranslation(["pages"]);

    return (
        <NavigationEntryCore
            caption={t("settings_info.app_version_description")}
            actionNode={`v${appVersion}`}
        >
            {t("settings_info.app_version_title")}
        </NavigationEntryCore>
    );
};

export { Version };