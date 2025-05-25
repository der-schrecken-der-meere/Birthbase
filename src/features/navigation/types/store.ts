// Packages
import type { FunctionComponent } from "react";
import type { LucideProps } from "lucide-react";

// Internal features
import type { PageLinks } from "../lib/constants/enums/PageLinks";

type CMDKStoreState = {
    /** Indicates whether the global search dialog is open */
    isOpen: boolean,
};
interface CMDKStore extends CMDKStoreState {
    /** Sets whether the global search dialog is open */
    setIsOpen: (isOpen: boolean) => void,
};

type LinkEntry = {
    /** Text for display */
    title: string,
    /** Url to the page */
    url?: PageLinks,
    /** Optional search parameter for better searching */
    search?: string,
    /** Optional shortcut */
    shortcut?: string,
    /** Descriptive icon */
    Icon: FunctionComponent<LucideProps>,
    /** When link is triggered */
    onClick?: () => void,
};

type NavigationLinksGroup = {
    /** Title of the group */
    title: string,
    /** Links in the group */
    links: LinkEntry[],
};

type NavigationLinksStoreState = {
    /** Group for storing main links */
    mainLinks: NavigationLinksGroup,
    /** Group for storing settings links */
    settingsLinks: NavigationLinksGroup,
    /** Group for storing misc action */
    miscActions: NavigationLinksGroup,
};

interface NavigationLinksStore extends NavigationLinksStoreState {
    /** Translates all groups to the current language */
    setTranslations: () => void,
};

type BreadcrumbOption = {
    /** Appears in the dropdown menu */
    display: string;
    /** URL to which the links points */
    href: string;
};

type BreadcrumbProps<T = BreadcrumbOption> = {
    type: T|T[]|((breadcrumbs: T|T[]) => T|T[]),
    id: string|number,
};

type AppNavigationStoreState = {
    /** Appears in the upper navbar */
    pageTitle: string,
    /** Options for rendering breadcrumbs in the upper navbar */
    breadcrumbs: BreadcrumbProps[]
};

interface AppNavigationStore extends AppNavigationStoreState {
    /** Sets the page title in the upper navbar */
    setPageTitle: (pageTitle: string) => void,
    /** Sets the breadcrumbs in the upper navbar */
    setBreadcrumbs: (breadCrumbs: BreadcrumbProps[]) => void,
}

export type {
    AppNavigationStore,
    AppNavigationStoreState,
    BreadcrumbOption,
    BreadcrumbProps,
    CMDKStore,
    CMDKStoreState,
    LinkEntry,
    NavigationLinksGroup,
    NavigationLinksStore,
    NavigationLinksStoreState
};