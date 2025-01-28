import { useNavbar } from '@/hooks/useNavbar'
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';

const Language = () => {

    useNavbar({
        pageTitle: "Sprache",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        null
    )
}

export default Language