// Packages
import type { PopoverTriggerProps } from "@radix-ui/react-popover";
import type { ForwardRefExoticComponent, HTMLAttributes } from "react";
import type { LucideProps } from "lucide-react";

// External features
import type { AppNotification } from "@/database/birthalert/notifications/types";
import type { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import type { ButtonProps } from "@/components/ui/button";
import type { DBRecord } from "@/lib/types/db";

type NotificationFilterProps = Omit<ButtonProps, "size"|"variant"> & {
    active: boolean,
};

type NotificationEntryProps = PopoverTriggerProps & {
    notification: AppNotification & DBRecord,
    notificationTitle: string,
    read: boolean,
    onDelete: (notification: AppNotification & DBRecord) => void,
    onRead: (notification: AppNotification & DBRecord) => void,
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
};

type NotificationEntryTypeProps<T extends NotificationGroup> = Omit<NotificationEntryProps, "Icon"|"read"|"notificationTitle"> & {
    notification: Extract<AppNotification, { group: T }>,
};

type NotificationFilterHeaderProps = HTMLAttributes<HTMLDivElement> & {
    filters: {
        onClick: () => void,
        text: string,
    }[],
    activeFilterIndex?: number,
};

type NotificationListProps = HTMLAttributes<HTMLDivElement> & {
    notifications: (AppNotification & DBRecord)[],
    onDelete: (notification: AppNotification & DBRecord) => void,
    onRead: (notification: AppNotification & DBRecord) => void,
};

export type {
    NotificationEntryProps,
    NotificationEntryTypeProps,
    NotificationFilterProps,
    NotificationFilterHeaderProps,
    NotificationListProps,
};