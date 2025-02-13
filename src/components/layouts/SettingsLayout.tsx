import { Outlet } from "react-router-dom";
import { PageLinks } from "@/globals/constants/links";
import { update_navbar } from "@/hooks/use_app_navbar";

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

    update_navbar({
        docTitle: "Birthbase - Einstellungen",
    });

    return (
        <Outlet/>
    );
};

export { SettingsLayout, SettingsLayoutBreadcrumbs };