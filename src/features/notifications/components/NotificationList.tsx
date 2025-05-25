import { cn } from "@/lib/utils";
import { NotificationListProps } from "../types/components";
import { Mailbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { BirthdayNotification } from "./notification_types/BirthdayNotification";
import { BirthdayReminderNotification } from "./notification_types/BirthdayReminderNotification";
import { InfoNotification } from "./notification_types/InfoNotification";

const NotificationList = ({
    className,
    notifications,
    onDelete,
    onRead,
    ...props
}: NotificationListProps) => {

    const { t } = useTranslation("pages");

    return (
        <div
            className={cn("h-full scrollbar-visible overflow-auto", className)}
            {...props}
        >
            {notifications.length === 0
                ? (
                    <div className="h-full flex flex-col justify-center items-center text-center margin-auto rounded-md text-muted-foreground text-sm">
                        <Mailbox className="w-20 h-20"/>
                        {t("notifications.empty")}
                    </div>
                ) : (
                    <div className="space-y-4 w-full table table-fixed">
                        {notifications.map((notification) => {
                            switch (notification.group) {
                                case NotificationGroup.BIRTHDAY:
                                    return <BirthdayNotification
                                        key={notification.id}
                                        notification={notification}
                                        onDelete={onDelete}
                                        onRead={onRead}
                                    />
                                case NotificationGroup.BIRTHDAY_REMINDER:
                                    return <BirthdayReminderNotification
                                        key={notification.id}
                                        notification={notification}
                                        onDelete={onDelete}
                                        onRead={onRead}
                                    />
                                case NotificationGroup.INFO:
                                    return <InfoNotification
                                        key={notification.id}
                                        notification={notification}
                                        onDelete={onDelete}
                                        onRead={onRead}
                                    />
                            }
                        })}
                    </div>
                )
            }
        </div>
    );
};

export { NotificationList };