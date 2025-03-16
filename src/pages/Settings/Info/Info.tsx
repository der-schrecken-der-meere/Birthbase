import { NavigationEntry } from '../Settings';
import { Separator } from '@/components/ui/separator';
import { OnlyTauri } from '@/components/OnlyTauri';

import { useAppStore } from '@/stores/use_app_store';

import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useTranslation } from 'react-i18next';

const Info = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.info",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <OnlyTauri osTypes={['windows', 'linux', 'macos', 'ios', 'android']}>
            <Version/>
            <TauriVersion/>
        </OnlyTauri>
    );
};

const Version = () => {
    const appVersion = useAppStore((state) => state.appVersion);
    const { t } = useTranslation(["pages"]);

    return (
        <>
            <NavigationEntry
                caption={t("settings_info.app_version_description")}
                rightElement={`v${appVersion}`}
            >
                {t("settings_info.app_version_title")}
            </NavigationEntry>
            <Separator/>
        </>
    );
};

const TauriVersion = () => {
    const tauriVersion = useAppStore((state) => state.tauriVersion);
    const { t } = useTranslation(["pages"]);

    return (
        <>
            <NavigationEntry
                caption={t("settings_info.tauri_version_description")}
                rightElement={`v${tauriVersion}`}
            >
                {t("settings_info.tauri_version_title")}
            </NavigationEntry>
        </>
    );
};

export default Info;