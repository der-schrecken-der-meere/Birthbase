import { Outlet } from "react-router-dom";
import { PageLinks } from "@/globals/constants/links";
import { update_navbar } from "@/hooks/use_app_navbar";
import { useTranslation } from "react-i18next";

const use_settings_breadcrumbs = () => {
    const { t } = useTranslation("navigation");

    return {
        breadcrumbs: [
            {
                id: "menu",
                type: [
                    {
                        display: t("main.home"),
                        href: PageLinks.HOME,
                    },
                    {
                        display: t("main.settings"),
                        href: PageLinks.SETTINGS,
                    }
                ]
            }
        ],
    }
};

const SettingsLayout = () => {

    update_navbar({
        docTitle: 'main.settings',
    });

    return (
        <Outlet/>
    );
};

export { SettingsLayout, use_settings_breadcrumbs };