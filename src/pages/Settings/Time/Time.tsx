import { useNavbar } from '@/hooks/useNavbar';
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';

const Time = () => {
    useNavbar({
        pageTitle: "Datum und Uhrzeit",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        null
    );
}

export default Time