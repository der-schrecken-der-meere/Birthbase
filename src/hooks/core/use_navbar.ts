import { useTranslation } from "react-i18next";
import { useNavbarStore, type UpdateNavbarProps } from "../../stores/use_navbar_store";
import { useEffect } from "react";

const useNavbar = ({
    breadcrumbDisplay,
    docTitle,
    pageTitle,
}: UpdateNavbarProps) => {
    const { t } = useTranslation(["navigation"]);
    const breadCrumbs = useNavbarStore((state) => state.breadCrumbs);
    const setBreadCrumbs = useNavbarStore((state) => state.setBreadCrumbs);
    const setDocumentTitle = useNavbarStore((state) => state.setDocumentTitle);
    const setPageTitle = useNavbarStore((state) => state.setPageTitle);

    useEffect(() => {
        if (breadcrumbDisplay) {
            let new_bread_crumbs = breadCrumbs;
            if (typeof breadcrumbDisplay === "function") {
                new_bread_crumbs = breadcrumbDisplay(new_bread_crumbs);
            } else {
                new_bread_crumbs = breadcrumbDisplay as any;
            }
            setBreadCrumbs(new_bread_crumbs);
        }
        if (docTitle) {
            setDocumentTitle(`Birthbase - ${t(docTitle)}`);
        }
        if (pageTitle) {
            setPageTitle(t(pageTitle));
        }
    }, [t]);

};

export {
    useNavbar,
};