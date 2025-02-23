import { Button, ButtonProps } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/database/tables/notifications/notifications";
import { del_notification_query, get_notifications_query, upd_notification_query } from "@/features/latest_notifications/query";
import { PageLinks } from "@/globals/constants/links";
import { format_number_to_relative_time } from "@/lib/intl/date";
import { get_relative_time_string } from "@/lib/functions/date/relative_time";
import { cn } from "@/lib/utils";
import { BellRing, Eye, Info, LucideProps, Mailbox, PartyPopper, Trash2 } from "lucide-react";
import { ForwardRefExoticComponent, useCallback, useEffect, useMemo, useState } from "react";
import { NotificationType } from "@/features/notify/notify";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverTriggerProps } from "@radix-ui/react-popover";
import { create_toast, ToastType } from "@/hooks/use_app_toast";
import { update_navbar } from "@/hooks/use_app_navbar";
import { useTranslation } from "react-i18next";

type FilterButtonProps = {
    onClick: () => void;
    text: string;
    active: boolean;
    filter?: NotificationType;
};

const FilterButton = ({
    onClick,
    active,
    children,
    text,
    className,
    ...props
}: FilterButtonProps & ButtonProps) => {
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={onClick}
            className={cn(active && "bg-accent", className)}
            {...props}
        >
            {text}
        </Button>
    );
};

const Notifications = () => {

    const { t } = useTranslation(["pages", "navigation", "toast"]);
    const ts = useCallback((key: string) => {
        return t(`notifications.${key}`);
    }, [t]);

    update_navbar({
        docTitle: "main.notifications",
        pageTitle: "main.notifications",
        breadcrumbDisplay: [
            {
                id: "menu",
                type: [
                    {
                        display: t("main.home", { ns: "navigation" }),
                        href: PageLinks.HOME,
                    }
                ]
            }
        ],
    });

    const { data, isFetching, error, isError } = get_notifications_query();
    const { mutate: delete_notification } = del_notification_query();
    const { mutate: update_notification } = upd_notification_query();

    const [ filter, setFilter ] = useState<NotificationType | null>(null);
    const [ active, setActive ] = useState(0);

    const onDelete = useCallback((notification: Notification) => {
        delete_notification(
            notification,
            {
                onError: (error) => {
                    console.error(error);
                    create_toast({
                        title: t("error", { ns: "generally" }),
                        description: t("errors.delete_notifications", { ns: "toast" }),
                    }, ToastType.ERROR);
                },
            }
        );
    }, []);

    const onRead = useCallback((notification: Notification) => {
        const new_notification: Notification = { ...notification, ...{ read: true } };
        update_notification(
            new_notification,
            {
                onError: (error) => {
                    console.error(error);
                    create_toast({
                        title: t("error", { ns: "generally" }),
                        description: t("errors.change_notifications", { ns: "toast" }),
                    }, ToastType.ERROR);
                },
            }
        );
    }, []);

    const filter_buttons = useMemo<FilterButtonProps[]>(() => [
        {
            active: true,
            text: t("notifications.all"),
            onClick: () => {
                setFilter(null);
                setActive(0);
            },
        },
        {
            active: false,
            text: t("notifications.birthday", { count: 2 }),
            onClick: () => {
                setFilter(NotificationType.BIRTHDAY);
                setActive(1);
            },
        },
        {
            active: false,
            text: t("notifications.reminder", { count: 2 }),
            onClick: () => {
                setFilter(NotificationType.BIRTHDAY_REMINDER);
                setActive(2);
            },
        },
        {
            active: false,
            text: t("notifications.info", { count: 2 }),
            onClick: () => {
                setFilter(NotificationType.INFO);
                setActive(3);
            },
        }
    ], [ts]);

    useEffect(() => {
        if (isError) {
            console.error(error);
            create_toast({
                title: t("error", { ns: "generally" }),
                description:t("errors.show_notifications", { ns: "toast" }),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    if (isFetching) {
        return (
            <Skeleton className='w-full h-36' />
        )
    }

    const filtered_data = (filter === null)
        ? data.data
        : data.filters[filter].map((index) => {
            return data.data[index];
        });

    return (
        <>
            <ScrollArea className="shrink-0 mb-2 table-fixed">
                <div className="flex gap-2">
                    {filter_buttons.map((filter_button, index) => {
                        return (
                            <FilterButton
                                key={`${index}-${filter_button.text}`}
                                onClick={filter_button.onClick}
                                active={index === active}
                                text={filter_button.text}
                            />
                        );
}                   )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <ScrollArea className="h-full">
                {filtered_data.length === 0
                    ? (
                        <div className="h-full flex flex-col justify-center items-center text-center margin-auto rounded-md text-muted-foreground text-sm">
                            <Mailbox className="w-20 h-20"/>
                            {ts("empty")}
                        </div>
                    ) : (
                        <div className="space-y-4 w-full table table-fixed mr-2">
                            {filtered_data.map((notification) => (
                                <NotificationMessage
                                    key={notification.id}
                                    muted={notification.read}
                                    notification={notification}
                                    onDelete={onDelete}
                                    onRead={onRead}
                                >
                                    {notification.text}
                                </NotificationMessage>
                            ))}
                        </div>
                    )
                }
            </ScrollArea>
        </>
    );
};

type NotificationMessageProps = PopoverTriggerProps & {
    muted: boolean,
    onDelete: (notification: Notification) => void,
    onRead: (notififcation: Notification) => void,
    notification: Notification,
};

const get_notification_parts = (
    type: NotificationType,
): { Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>, title: string } => {
    switch (type) {
        case NotificationType.BIRTHDAY:
            return {
                Icon: PartyPopper,
                title: "birthday",
            };
        case NotificationType.BIRTHDAY_REMINDER:
            return {
                Icon: BellRing,
                title: "reminder",
            };
        case NotificationType.INFO:
            return {
                Icon: Info,
                title: "info",
            };
    }
};

const NotificationMessage = ({
    className,
    children,
    muted,
    onDelete,
    onRead,
    notification,
    ...props
}: NotificationMessageProps) => {
    const { t, i18n } = useTranslation(["pages", "generally"]);

    const obj_time = get_relative_time_string(notification.timestamp, Date.now());
    const str_time_pasted = format_number_to_relative_time(i18n.language, -obj_time.time, obj_time.unit);

    const { Icon, title } = get_notification_parts(notification.type);

    return (
        <Popover>
            <PopoverTrigger
                className={cn("w-full flex rounded-lg border-[1px] p-3 gap-4 bg-secondary items-stretch", notification.read && "text-muted-foreground bg-transparent", className)}
                {...props}
            >
                <Icon className="h-8 w-8 self-center shrink-0" />
                <div className="w-full">
                    <div className="float-right w-40 h-5 text-right text-muted-foreground text-sm mr-2">{str_time_pasted}</div>
                    <div className="text-left text-current/80">
                        <div className="font-bold">{t(`notifications.${title}`, { count: 1 })}</div>
                        {children}
                    </div>
                    
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-1 flex flex-col gap-1">
                {!notification.read && (
                    <Button
                        onClick={() => onRead(notification)}
                        size="sm"
                        variant="outline"
                    >
                        <Eye className="w-4 h-4 mr-2"/>
                        {t("notifications.mark_read")}
                    </Button>
                )}
                <Button
                    onClick={() => onDelete(notification)}
                    size="sm"
                    variant="outline"
                >
                    <Trash2 className="w-4 h-4 mr-2"/>
                    {t("delete_btn", { ns: "generally" })}
                </Button>
            </PopoverContent>
        </Popover>
        
    );
};

export default Notifications;