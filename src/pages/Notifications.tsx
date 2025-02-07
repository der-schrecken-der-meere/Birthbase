import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/database/tables/notifications/notifications";
import { del_notification_query, get_notifications_query } from "@/features/latest_notifications/query";
import { PageLinks } from "@/globals/constants/links";
import { useAppToast } from "@/hooks/useAppToast";
import { useNavbar } from "@/hooks/useNavbar";
import { format_number_to_relative_time } from "@/lib/intl/date";
import { get_relative_time_string } from "@/lib/functions/date/relative_time";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { HtmlHTMLAttributes, useCallback, useEffect } from "react";

const Notifications = () => {

    useNavbar({
        docTitle: "Birthbase - Benachrichtigungen",
        pageTitle: "Benachrichtigungen",
        breadcrumbDisplay: [
            {
                id: "menu",
                type: [
                    {
                        display: "Startseite",
                        href: PageLinks.HOME,
                    }
                ]
            }
        ],
    });

    const { data, isFetching, error, isError } = get_notifications_query();
    const { mutate: delete_notification } = del_notification_query();
    const { setErrorNotification } = useAppToast();

    const onDelete = useCallback((notification: Notification) => {
        delete_notification(
            notification,
            {
                onError: (error) => {
                    setErrorNotification({
                        title: "Fehler beim Löschen der Benachrichtigung",
                        description: JSON.stringify(error),
                    })
                },
            }
        );
    }, [data]);

    useEffect(() => {
        if (isError) {
            setErrorNotification({
                title: "Fehler beim Anzeigen der Benachrichtigungen",
                description: JSON.stringify(error),
            })
        }
    }, [isError, error]);

    if (isFetching) {
        return (
            <Skeleton className='w-full h-36' />
        )
    }

    return (
        <ScrollArea className="h-full">
            {data.length === 0
                ? <div className="h-full flex justify-center items-center text-center margin-auto rounded-md text-muted-foreground text-sm">Sie haben keine ungelesenen Benachrichtigungen</div>
                : <div className="space-y-2 w-full table table-fixed">
                    {data.map((notification) => (
                        <NotificationMessage
                            key={notification.id}
                            muted={notification.read}
                            notification={notification}
                            onDelete={onDelete}
                        >
                            {notification.text}
                        </NotificationMessage>
                    ))}
                </div>
            }
            {/* <div className="h-[10000px]"></div> */}
        </ScrollArea>
    );
};

type NotificationMessageProps = HtmlHTMLAttributes<HTMLDivElement> & {
    muted: boolean,
    onDelete: (notification: Notification) => void,
    notification: Notification,
};

const NotificationMessage = ({
    className,
    children,
    muted,
    onDelete,
    notification,
    ...props
}: NotificationMessageProps) => {
    const obj_time = get_relative_time_string(notification.timestamp, Date.now());
    const str_time_pasted = format_number_to_relative_time("de", -obj_time.time, obj_time.unit);

    return (
        <div
            className={cn("w-full flex rounded-md border-[1px] p-3 gap-2 items-stretch", className)}
            {...props}
        >
            {/* Text */}
            <ScrollArea className="w-full">
                {children}
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex flex-col ml-auto gap-1 shrink-0">
                <div className="text-right text-muted-foreground text-sm mr-2">{str_time_pasted}</div>
                <div className="flex justify-end mt-auto">
                    {/* <Button
                        size="icon"
                        variant="ghost"
                    >
                        <EyeOff className="w-4 h-4"/>
                    </Button> */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => onDelete(notification)}
                    >
                        <Trash2 className="w-4 h-4"/>
                    </Button>
                </div>
                {/* <div className="text-right text-muted-foreground text-sm mr-2">29d</div> */}
            </div>
        </div>
    );
};

export default Notifications;