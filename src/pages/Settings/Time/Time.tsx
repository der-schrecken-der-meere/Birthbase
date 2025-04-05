import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';

const Time = () => {

    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.time",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <></>
    );
};

export default Time;