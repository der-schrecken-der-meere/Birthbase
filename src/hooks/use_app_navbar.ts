import { useEffect } from "react";
import { create } from "zustand";

type BreadcrumbProps = {
    /** The display string which will be rendered in menu bar or in a separate dropdown menu */
    display: string;
    /** URL where the link points to */
    href: string;
};

type BreadcrumbDisplayProps<T = BreadcrumbProps> = {
    type: T|T[]|((breadcrumbs: T|T[]) => T|T[]),
    id: any,
};

type UpdateNavbarProps <T = BreadcrumbDisplayProps[]> = {
    /** Sets the docTitle property when the component mounts */
    docTitle?: string;
    /** Sets the pageTitle property when the component mounts */
    pageTitle?: string;
    /** Sets how the breadcurmb will be displayed */
    breadcrumbDisplay?: ((breadcrumbs: T) => T) | T;
}

interface AppNavbar {
    page_title: string,
    document_title: string,
    bread_crumbs: BreadcrumbDisplayProps[],
    set_document_title: (document_title: string) => void,
    set_page_title: (set_page_title: string) => void,
    set_bread_crumbs: (bread_crumbs: BreadcrumbDisplayProps[]) => void,
};

const use_app_navbar = create<AppNavbar>()((set) => ({
    page_title: "",
    document_title: "",
    bread_crumbs: [],
    set_document_title: (document_title) => set(() => ({ document_title })),
    set_page_title: (page_title) => set(() => ({ page_title })),
    set_bread_crumbs: (bread_crumbs) => set(() => ({ bread_crumbs })),
}));

const update_navbar = ({
    breadcrumbDisplay,
    docTitle,
    pageTitle,
}: UpdateNavbarProps) => {
    useEffect(() => {
        if (breadcrumbDisplay) {
            const bread_crumbs = use_app_navbar.getState().bread_crumbs;
            let new_bread_crumbs = bread_crumbs;
            if (typeof breadcrumbDisplay === "function") {
                new_bread_crumbs = breadcrumbDisplay(bread_crumbs);
            } else {
                new_bread_crumbs = breadcrumbDisplay as any;
            }
            use_app_navbar.getState().set_bread_crumbs(new_bread_crumbs);
        }
        if (docTitle) {
            use_app_navbar.getState().set_document_title(docTitle);
            document.title = docTitle;
        }
        if (pageTitle) {
            use_app_navbar.getState().set_page_title(pageTitle);
        }
    }, []);
};

export type { BreadcrumbProps, BreadcrumbDisplayProps };
export {
    use_app_navbar,
    update_navbar,
};