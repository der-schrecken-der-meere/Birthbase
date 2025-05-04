import { useSettingsBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { BackupSettingsPage } from "@/features/backup/components/settings_page";
import { useNavbar } from "@/hooks/core/use_navbar";

const Backup = () => {

    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.backup",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <BackupSettingsPage/>
    );
};

export default Backup;