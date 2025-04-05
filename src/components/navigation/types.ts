import type { BreadcrumbDisplayProps, BreadcrumbProps } from "@/stores/use_navbar_store";

type UpperNavbarProps = {
    pageTitle: string,
    notifications: number,
};

type UpperMobileNavbarProps = {
    breadcrumbs: BreadcrumbDisplayProps<BreadcrumbProps>[],
} & UpperNavbarProps;

export type {
    UpperNavbarProps,
    UpperMobileNavbarProps,
};