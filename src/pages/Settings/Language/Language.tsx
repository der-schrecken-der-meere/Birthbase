import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { update_navbar } from '@/hooks/use_app_navbar';

const Language = () => {

    update_navbar({
        pageTitle: "Sprache",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        null
    )
}

export default Language