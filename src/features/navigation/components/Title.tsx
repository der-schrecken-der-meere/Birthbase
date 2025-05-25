// Packages
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// External features
import { useAppStore } from "@/stores/use_app_store";

// Internal features
import { TitleProps } from "../types/components";
import { useNavigationStore } from "../stores/use_navigation";

const Title = ({
   breadcrumbs,
   pageTitleKey,
   documentTitleKey,
   ...props 
}: TitleProps) => {

    // Stores
    const appName = useAppStore((state) => state.appName);
    const storeBreadcrumbs = useNavigationStore((state) => state.breadcrumbs);
    const setBreadcrumbs = useNavigationStore((state) => state.setBreadcrumbs);
    const setPageTitle = useNavigationStore((state) => state.setPageTitle);

    // Hooks
    const { t } = useTranslation("navigation");

    // Constants
    const additionalTitleText = documentTitleKey ? ` - ${t(documentTitleKey)}` : "";

    useEffect(() => {
        if (breadcrumbs) {
            let new_bread_crumbs = storeBreadcrumbs;
            if (typeof breadcrumbs === "function") {
                new_bread_crumbs = breadcrumbs(new_bread_crumbs);
            } else {
                new_bread_crumbs = breadcrumbs;
            }
            setBreadcrumbs(new_bread_crumbs);
        }
        if (pageTitleKey) {
            setPageTitle(pageTitleKey);
        }
    }, []);

    return (
        <title {...props}>{`${appName}${additionalTitleText}`}</title>
    );
};

export { Title };