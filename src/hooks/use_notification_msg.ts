import { NotificationGroupType, NotificationType } from "@/database/tables/notifications/notifications";
import { VersionNumber } from "@/lib/types/number";
import { BellRing, Check, Download, LucideProps, PartyPopper } from "lucide-react";
import { ForwardRefExoticComponent } from "react";
import { useTranslation } from "react-i18next";

type IconProps = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
type MsgData = {
    title: string,
    description: string,
};
type UseNotificationMsgProps = {
    group_type: NotificationGroupType.BIRTHDAY,
    data: {
        firstname: string,
        lastname: string,
    },
} | {
    group_type: NotificationGroupType.BIRTHDAY_REMINDER,
    data: {
        firstname: string,
        lastname: string,
        until: number,
    },
} | {
    group_type: NotificationGroupType.INFO,
    data: {
        type: NotificationType.UPDATE_AVAILABLE,
        version: VersionNumber,
    } | {
        type: NotificationType.UPDATE_INSTALLED,
        version: VersionNumber,
    },
};

const useNotificationMsgTranslation = ({
    group_type,
    data: notification_data,
}: UseNotificationMsgProps): {
    Icon: IconProps,
    t_data: MsgData,
} => {
    const { t } = useTranslation(["notification"]);

    console.log(group_type, notification_data);

    let data: MsgData = {} as any;
    let Icon: IconProps = PartyPopper;

    switch (group_type) {
        case NotificationGroupType.BIRTHDAY:
            data = {
                title: t("birthday.title"),
                description: t("birthday.body", {
                    firstname: notification_data.firstname,
                    lastname: notification_data.lastname,
                    count: 0,
                }),
            }
            break;
        case NotificationGroupType.BIRTHDAY_REMINDER:
            data = {
                title: t("birthday_reminder.title"),
                description: t("birthday.body", {
                    firstname: notification_data.firstname,
                    lastname: notification_data.lastname,
                    count: notification_data.until,
                }),
            };
            Icon = BellRing;
            break;
        case NotificationGroupType.INFO:
            console.log(notification_data.type);
            if (
                notification_data.type === NotificationType.UPDATE_AVAILABLE
            ) {
                data = {
                    title: t("update_available.title"),
                    description: t("update_available.description", {
                        version: notification_data.version,
                    }),
                };
                Icon = Download;
            } else {
                data = {
                    title: t("update_installed.title"),
                    description: t("update_installed.description", {
                        version: notification_data.version,
                    }),
                };
                Icon = Check;
            }
    }

    return {
        t_data: data,
        Icon,
    };
};

export type {
    UseNotificationMsgProps,
};
export {
    useNotificationMsgTranslation,
};