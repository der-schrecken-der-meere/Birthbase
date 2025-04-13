import type { ReactNode, HTMLAttributes, FunctionComponent } from "react";
import type { LucideProps } from "lucide-react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { NavLinkProps } from "react-router-dom";

type NavigationEntryCoreProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * An Element that will be rendered on the left side (ltr)
     * indented for visual support (e.g. an icon)
     */
    icon?: FunctionComponent<LucideProps>;
    /**
     * An Element that will be rendered on the right side (ltr)
     * intended for interaction (e.g. a button)
     */
    actionNode?: ReactNode;
    /**
     * An Element that will be rendered on the bottom
     * intended for additional information (e.g. a description)
     */
    caption?: ReactNode;
    /**
     * An Element that will be rendered as the title
     * intended for the short descripiton for the main action (e.g. a title)
     */
    children?: ReactNode;
};

type CollapsibleNavigationEntryProps = Omit<NavigationEntryCoreProps, "actionNode"> & {
    /**
     * An Element that will be rendered in the collapsible content
     */
    children: ReactNode;
    /**
     * An Element that will be rendered as the title
     * intended for the short descripiton for the main action (e.g. a title)
     */
    title?: NavigationEntryCoreProps["children"];
};

type SettingsFormWrapperProps<T extends FieldValues> = Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> & {
    form: UseFormReturn<T, any, undefined>;
    onSubmit: (data: T) => void;
};

type NavigationLinkProps = Omit<NavigationEntryCoreProps, "actionNode"> & Pick<NavLinkProps, "to">;

export type {
    NavigationEntryCoreProps,
    NavigationLinkProps,
    CollapsibleNavigationEntryProps,
    SettingsFormWrapperProps,
};