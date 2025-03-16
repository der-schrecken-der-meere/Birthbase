import { Outlet } from "react-router-dom";
import { PageLinks } from "@/globals/constants/links";
import { useNavbar } from "@/hooks/core/use_navbar";
import { useTranslation } from "react-i18next";

const useSettingsBreadcrumbs = () => {
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

    useNavbar({
        docTitle: 'main.settings',
    });

    return (
        <Outlet/>
    );
};

export { SettingsLayout, useSettingsBreadcrumbs };