import { createContext, type Dispatch, type SetStateAction, useCallback, useContext, useEffect } from "react";

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

interface NavbarContextProps {
    /** The title of the current page. It will be displayed in the horizontal navbar */
    pageTitle: string,
    /** The order of the breadcrumb */
    breadcrumbs: BreadcrumbDisplayProps[],
    /** Sets the pageTitle property */
    setPageTitle: Dispatch<SetStateAction<string>>,
    /** Sets the order of the breadcrumbs */
    setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbDisplayProps[]>>,
};

interface useNavbarProps <T = BreadcrumbDisplayProps[]> {
    /** Sets the docTitle property when the component mounts */
    docTitle?: string;
    /** Sets the pageTitle property when the component mounts */
    pageTitle?: string;
    /** Sets how the breadcurmb will be displayed */
    breadcrumbDisplay?: ((breadcrumbs: T) => T) | T;
}

interface useNavbarReturnProps {
    /** The title of the current tab in the browser. */
    docTitle: string;
    /** The title of the current page. It will be displayed in the horizontal navbar */
    pageTitle: string;
    /** The order of the breadcrumb */
    breadcrumbs: BreadcrumbDisplayProps[];
    /** Sets the docTitle property */
    setDocTitle: (docTitle: string) => void;
    /** Sets the pageTitle property */
    setPageTitle: Dispatch<SetStateAction<string>>;
    /** Sets the order of the breadcrumbs */
    setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbDisplayProps[]>>;
}

const NavbarContext = createContext<NavbarContextProps>({
    pageTitle: "",
    breadcrumbs: [],
    setPageTitle: () => {},
    setBreadcrumbs: () => {},
});


const useNavbar = ({
    docTitle: _docTitle,
    pageTitle: _pageTitle,
    breadcrumbDisplay,
}: useNavbarProps): useNavbarReturnProps => {

    const useNavbarProps = useContext(NavbarContext);

    const setDocTitle = useCallback((docTitle: string) => {
        document.title = docTitle;
    }, []);

    useEffect(() => {
        if (_pageTitle) useNavbarProps.setPageTitle(_pageTitle);
        if (_docTitle) setDocTitle(_docTitle);

        if (breadcrumbDisplay) {
            useNavbarProps.setBreadcrumbs((breads) => {
                if (typeof breadcrumbDisplay === "function") return breadcrumbDisplay(breads);
                return breadcrumbDisplay;
            });
        };
    }, []);

    return {
        docTitle: document.title,
        setDocTitle,
        ...useNavbarProps
    };
};

export type { BreadcrumbProps, BreadcrumbDisplayProps, useNavbarReturnProps };
export { useNavbar, NavbarContext };
