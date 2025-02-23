import { NavigationEntry } from '../Settings';
import { Separator } from '@/components/ui/separator';
import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout';
import { isTauri } from '@tauri-apps/api/core';
import { use_app_store } from '@/hooks/use_app_store';
import { update_navbar } from '@/hooks/use_app_navbar';
import { useTranslation } from 'react-i18next';

const Info = () => {
    const { breadcrumbs } = use_settings_breadcrumbs();

    update_navbar({
        pageTitle: "settings.info",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        isTauri()
            ?
                <>
                    <Version/>
                    <TauriVersion/>
                </>
            :
                null
    );
};

const Version = () => {
    const version = use_app_store((state) => state.version);
    const { t } = useTranslation(["pages"]);

    return (
        <>
            <NavigationEntry
                caption={t("settings_info.app_version_description")}
                rightElement={`v${version}`}
            >
                {t("settings_info.app_version_title")}
            </NavigationEntry>
            <Separator/>
        </>
    );
};

const TauriVersion = () => {
    const tauri_version = use_app_store((state) => state.tauri_version);
    const { t } = useTranslation(["pages"]);

    return (
        <>
            <NavigationEntry
                caption={t("settings_info.tauri_version_description")}
                rightElement={`v${tauri_version}`}
            >
                {t("settings_info.tauri_version_title")}
            </NavigationEntry>
        </>
    );
};

export default Info;