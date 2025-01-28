import { BreadcrumbDisplayProps } from "@/hooks/useNavbar";
import { ReactNode, useMemo, useState } from "react";
import { NavbarContext } from "@/hooks/useNavbar";

interface NavbarProviderProps {
    children: ReactNode,
    defaultPageTitle?: string,
}

const NavbarProvider = ({
    children,
    defaultPageTitle = "",
}: NavbarProviderProps) => {
    const [pageTitle, setPageTitle] = useState(defaultPageTitle);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbDisplayProps[]>([]);

    const contextValue = useMemo(() => ({
        pageTitle,
        setPageTitle,
        breadcrumbs,
        setBreadcrumbs,
    }), [pageTitle, breadcrumbs]);

    return (
        <NavbarContext.Provider value={contextValue}>
            {children}
        </NavbarContext.Provider>
    );
};

export { NavbarProvider };