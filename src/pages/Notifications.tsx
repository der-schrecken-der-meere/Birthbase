import { type ButtonProps } from "@/components/ui/button";
import { type Birthday } from "@/database/tables/birthday/birthdays";
import { type AppNotification, type AppNotificationProps, NotificationGroupType } from "@/database/tables/notifications/notifications";
import { type PopoverTriggerProps } from "@radix-ui/react-popover";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Mailbox, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useGetNotificationsQuery } from "@/features/latest_notifications/query";
import { useNavbar } from "@/hooks/core/use_navbar";
import { useTranslation } from "react-i18next";
import { useNotificationMutation } from "@/hooks/use_notification_mutation";
import { useQuery } from "@/hooks/core/use_query";
import { type UseNotificationMsgProps, useNotificationMsgTranslation } from "@/hooks/use_notification_msg";
import { useGetBirthdayQuery } from "@/features/manage_birthdays/query";

import { PageLinks } from "@/globals/constants/links";
import { format_number_to_relative_time } from "@/lib/intl/date";
import { get_relative_time_string } from "@/lib/functions/date/relative_time";
import { cn } from "@/lib/utils";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";
import { NotificationSkeleton } from "@/components/skeletons/NotificationSkeleton";

type FilterButtonProps = {
    onClick: () => void;
    text: string;
    active: boolean;
    filter?: NotificationGroupType;
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

    const { t } = useTranslation(["pages", "navigation"]);
    const ts = (key: string) => {
        return t(`notifications.${key}`);
    };

    useNavbar({
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

    const { data, isFetching } = useQuery({
        useQueryFn: useGetNotificationsQuery,
        tKey: "notifications",
    });

    const {
        del,
        upd,
    } = useNotificationMutation({});

    const [ filter, setFilter ] = useState<NotificationGroupType | null>(null);
    const [ active, setActive ] = useState(0);

    const onDelete = (notification: AppNotification) => {
        del(notification);
    };

    const onRead = (notification: AppNotification) => {
        upd({ ...notification, ...{ read: true } });
    };

    const filter_buttons: FilterButtonProps[] = [
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
                setFilter(NotificationGroupType.BIRTHDAY);
                setActive(1);
            },
        },
        {
            active: false,
            text: t("notifications.reminder", { count: 2 }),
            onClick: () => {
                setFilter(NotificationGroupType.BIRTHDAY_REMINDER);
                setActive(2);
            },
        },
        {
            active: false,
            text: t("notifications.info", { count: 2 }),
            onClick: () => {
                setFilter(NotificationGroupType.INFO);
                setActive(3);
            },
        }
    ];

    if (isFetching) {
        return (
            <NotificationSkeleton/>
        )
    }

    const filtered_data = (filter === null)
        ? data.data
        : data.filters[filter].map((index) => {
            return data.data[index];
        });

    return (
        <>
            <div className="shrink-0 mb-2 table-fixed overflow-auto scrollbar-visible">
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
                    })}
                </div>
            </div>
            <div className="h-full scrollbar-visible overflow-auto">
                {filtered_data.length === 0
                    ? (
                        <div className="h-full flex flex-col justify-center items-center text-center margin-auto rounded-md text-muted-foreground text-sm">
                            <Mailbox className="w-20 h-20"/>
                            {ts("empty")}
                        </div>
                    ) : (
                        <div className="space-y-4 w-full table table-fixed">
                            {filtered_data.map((notification) => {
                                switch (notification.group_type) {
                                    case NotificationGroupType.BIRTHDAY:
                                        return <BirthdayWrapper
                                            key={notification.id}
                                            notification={notification}
                                            muted={notification.read}
                                            onDelete={onDelete}
                                            onRead={onRead}
                                        />
                                    case NotificationGroupType.BIRTHDAY_REMINDER:
                                        return <BirthdayRemindeWrapper
                                            key={notification.id}
                                            notification={notification}
                                            muted={notification.read}
                                            onDelete={onDelete}
                                            onRead={onRead}
                                        />
                                    case NotificationGroupType.INFO:
                                        return <UpdateWrapper
                                            key={notification.id}
                                            notification={notification}
                                            muted={notification.read}
                                            onDelete={onDelete}
                                            onRead={onRead}
                                        />
                                }
                            })}
                        </div>
                    )
                }
            </div>
        </>
    );
};

const NotificationEntrySkeleton = () => {
    return (
        <Skeleton
            className="w-full h-16"
        />
    );
};

type WrapperNotification<T extends NotificationGroupType> = Omit<NotificationMessageProps, "notification" | "notificationData"> & {
    notification: Omit<AppNotification, "group_type" | "data"> & Extract<AppNotificationProps, { group_type: T }>,
};

const BirthdayWrapper = ({
    notification,
    ...props
}: WrapperNotification<NotificationGroupType.BIRTHDAY>) => {

    const { data: { id } } = notification;

    console.log("id", id);

    const { data, isFetching, isLoading, isError } = useGetBirthdayQuery(id);

    if (isError) {
        return null;
    }

    if (isLoading || isFetching) {
        return (
            <NotificationEntrySkeleton/>
        )
    }

    console.log("data", data);

    return (
        <NotificationMessage
            notification={notification}
            notificationData={{ firstname: (data as Birthday).name.first, lastname: (data as Birthday).name.last } as any}
            {...props}
        />
    );
};

const BirthdayRemindeWrapper = ({
    notification,
    ...props
}: WrapperNotification<NotificationGroupType.BIRTHDAY_REMINDER>) => {

    const { data: { id } } = notification;

    const { data, isFetching, isLoading, isError } = useGetBirthdayQuery(id);

    if (isError) {
        return null;
    }

    if (isLoading || isFetching) {
        return (
            <Skeleton
                className="w-full h-19"
            />
        )
    }

    return (
        <NotificationMessage
            notificationData={{
                firstname: (data as Birthday).name.first,
                lastname: (data as Birthday).name.last,
                until: calculate_days_until_next_birthday((data as Birthday).timestamp),
            } as any}
            notification={notification}
            {...props}
        />
    );
};

const UpdateWrapper = ({
    notification,
    ...props
}: WrapperNotification<NotificationGroupType.INFO>) => {
    return (
        <NotificationMessage
            notificationData={{
                type: notification.data.type,
                version: notification.data.version
            } as any}
            notification={notification}
            {...props}
        />
    );
};

type NotificationMessageProps = PopoverTriggerProps & {
    muted: boolean,
    onDelete: (notification: AppNotification) => void,
    onRead: (notififcation: AppNotification) => void,
    notificationData: UseNotificationMsgProps,
    notification: AppNotification,
};

const NotificationMessage = ({
    className,
    muted,
    onDelete,
    onRead,
    notification,
    notificationData,
    ...props
}: Omit<NotificationMessageProps, "children">) => {
    const { group_type, read, timestamp } = notification;

    console.log(notificationData);

    const { t_data: { title, description }, Icon } = useNotificationMsgTranslation({
        group_type,
        /** @ts-ignore */
        data: notificationData,
    });

    const { t, i18n } = useTranslation(["generally", "pages"]);

    const obj_time = get_relative_time_string(timestamp, Date.now());
    const str_time_pasted = format_number_to_relative_time(i18n.language, -obj_time.time, obj_time.unit);

    const on_delete = () => {
        onDelete(notification as AppNotification);
    };

    const on_read = () => {
        onRead(notification as AppNotification);
    };

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    "w-full flex rounded-lg border-[1px] p-3 gap-4 bg-secondary items-stretch",
                    read && "text-muted-foreground bg-transparent",
                    className
                )}
                {...props}
            >
                <Icon className="h-8 w-8 self-center shrink-0" />
                <div className="w-full">
                    <div className="float-end w-max h-5 text-end text-muted-foreground text-sm mx-2">
                        {str_time_pasted}
                    </div>
                    <div className="text-start text-current/80">
                        <div className="font-bold">
                            {title}
                        </div>
                        {description}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-1 flex flex-col gap-1">
                {!read && (
                    <Button
                        onClick={on_read}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4"/>
                        {t("notifications.mark_read", { ns: "pages" })}
                    </Button>
                )}
                <Button
                    onClick={on_delete}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                >
                    <Trash2 className="w-4 h-4"/>
                    {t("delete_btn", { ns: "generally" })}
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export default Notifications;