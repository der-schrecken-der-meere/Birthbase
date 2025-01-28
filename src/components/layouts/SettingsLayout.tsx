import { Outlet } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import { PageLinks } from "@/globals/constants/links";

const SettingsLayoutBreadcrumbs = [
    {
        id: "menu",
        type: [
            {
                display: "Startseite",
                href: PageLinks.HOME,
            },
            {
                display: "Einstellungen",
                href: PageLinks.SETTINGS,
            }
        ]
    }
];

const SettingsLayout = () => {

    useNavbar({
        docTitle: "Birthbase - Einstellungen",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs
    });

    return (
        <Outlet/>
    );
};

export { SettingsLayout, SettingsLayoutBreadcrumbs };