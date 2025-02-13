import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { update_navbar } from '@/hooks/use_app_navbar';

const Time = () => {

    update_navbar({
        pageTitle: "Datum und Uhrzeit",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        null
    );
}

export default Time