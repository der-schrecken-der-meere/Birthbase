// Packages
import type { FunctionComponent, HTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router-dom";
import type { LucideProps } from "lucide-react";

// External features
import type { ButtonProps } from "@/components/ui/button";

// Internal features
import type { BreadcrumbProps, LinkEntry } from "./store";

type CMDKProps = {
    setIsOpen: (isOpen: boolean) => void,
};

type CMDKEntryProps = LinkProps & {
    /** Hidden words for better searching */
    search?: string,
    /** Shortcut description */
    shortcut?: string,
    Icon: FunctionComponent<LucideProps>,
};

type AppSidebarEntryProps = HTMLAttributes<HTMLLIElement> & {
    url?: string,
    Icon: FunctionComponent<LucideProps>
    badge?: ReactNode,
};

type AppSidebarMiscProps = {
    linkEntries: LinkEntry[],
    title: string,
};

type GoBackInHistoryProps = Omit<ButtonProps, "disabled"|"onClick"|"children"> & {
    amount?: number,
};

type UpperNavbarProps = {
    pageTitle: string,
    notifications: number,
};

type UpperNavbarDesktopProps = UpperNavbarProps & {
    breadcrumbs: BreadcrumbProps[]
};

type TitleProps<T = BreadcrumbProps[]> = Omit<HTMLAttributes<HTMLTitleElement>, "children"> & {
    /** Optional breadcrumbs to render */
    breadcrumbs?: ((breadcrumbs: T) => T) | T,
    /** Translation key for navbar */
    pageTitleKey?: string,
    /** Translation key to render after the app name in the document title */
    documentTitleKey?: string,
};

export type {
    AppSidebarEntryProps,
    AppSidebarMiscProps,
    CMDKEntryProps,
    CMDKProps,
    GoBackInHistoryProps,
    TitleProps,
    UpperNavbarProps,
    UpperNavbarDesktopProps,
};