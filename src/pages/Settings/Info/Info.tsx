import { NavigationEntry } from '../Settings';
import { Separator } from '@/components/ui/separator';
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { isTauri } from '@tauri-apps/api/core';
import { use_app_store } from '@/hooks/use_app_store';
import { update_navbar } from '@/hooks/use_app_navbar';

const Info = () => {

    update_navbar({
        pageTitle: "Info",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
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

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${version}`}
            >
                App-Version
            </NavigationEntry>
            <Separator/>
        </>
    );
};

const TauriVersion = () => {
    const tauri_version = use_app_store((state) => state.tauri_version);

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${tauri_version}`}
            >
                Tauri-Version
            </NavigationEntry>
        </>
    );
};

export default Info;