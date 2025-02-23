import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout';
import { update_navbar } from '@/hooks/use_app_navbar';

const Time = () => {

    const { breadcrumbs } = use_settings_breadcrumbs();

    update_navbar({
        pageTitle: "settings.time",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        null
    );
};

export default Time;