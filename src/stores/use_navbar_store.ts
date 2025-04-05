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
    /** String representing the key of the doc title translation */
    docTitle?: string;
    /** String representing the key of the page heading translation */
    pageTitle?: string;
    /** Sets how the breadcurmb will be displayed */
    breadcrumbDisplay?: ((breadcrumbs: T) => T) | T;
}

interface AppNavbar {
    /** Current page title that will be shown in the upper navbar */
    pageTitle: string,
    /** Document title (only useful for website) */
    documentTitle: string,
    /** Breadcumbs that will be rendered */
    breadCrumbs: BreadcrumbDisplayProps[],
    setDocumentTitle: (documentTitle: string) => void,
    setPageTitle: (pageTitle: string) => void,
    setBreadCrumbs: (breadCrumbs: BreadcrumbDisplayProps[]) => void
};

const useNavbarStore = create<AppNavbar>()((set) => ({
    pageTitle: "",
    documentTitle: "",
    breadCrumbs: [],
    setBreadCrumbs: (breadCrumbs) => {
        set(() => ({ breadCrumbs }));
    },
    setDocumentTitle: (documentTitle) => {
        document.title = documentTitle;
        set(() => ({ documentTitle }))
    },
    setPageTitle: (pageTitle) => {
        set(() => ({ pageTitle }));
    },
}));

export type {
    BreadcrumbProps,
    BreadcrumbDisplayProps,
    UpdateNavbarProps
};
export {
    useNavbarStore,
};