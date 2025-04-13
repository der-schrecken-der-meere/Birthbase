import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { Separator } from '@/components/ui/separator';
import { useNavbar } from '@/hooks/core/use_navbar';

let Version = null;
let TauriVersion = null;
if (__IS_TAURI__) {
    Version = await import("./__tauri__/Version").then(module => module.Version);
    TauriVersion = await import("./__tauri__/TauriVersion").then(module => module.TauriVersion);
}

const Info = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.info",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <>
            {Version && (
                <>
                    <Version/>
                    <Separator/>
                </>
            )}
            {TauriVersion && (
                <TauriVersion/>
            )}
        </>
    );
};

export default Info;