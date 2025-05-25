// Packages
import { useTranslation } from "react-i18next";
import { PartyPopper } from "lucide-react";

// External features
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";

// Internal features
import type { NotificationEntryTypeProps } from "../../types/components";
import { NotificationEntry } from "../NotificationEntry";
import { NotificationType } from "@/database/birthalert/notifications/enums/type";

const InfoNotification = ({
    notification,
    children: _2,
    ...props
}: NotificationEntryTypeProps<NotificationGroup.INFO>) => {

    const { t } = useTranslation("notification");

    const { data: { version, type } } = notification;

    let titleKey = type === NotificationType.UPDATE_AVAILABLE ? "update_available" : "update_installed";

    const notificationTitle = t(`${titleKey}.title`);
    const description = t(`${titleKey}.bpdy`, {
        version,
    });

    return (
        <NotificationEntry
            notification={notification}
            notificationTitle={notificationTitle}
            read={notification.read}
            Icon={PartyPopper}
            {...props}
        >
            {description}
        </NotificationEntry>
    );
};

export { InfoNotification };