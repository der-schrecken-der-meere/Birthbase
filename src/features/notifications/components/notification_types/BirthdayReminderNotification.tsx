// Packages
import { useTranslation } from "react-i18next";
import { PartyPopper } from "lucide-react";

// External features
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { useGetBirthdayQuery } from "@/features/birthdays/queries/birthdays/use_get_birthday";

// Internal features
import type { NotificationEntryTypeProps } from "../../types/components";
import { NotificationEntry } from "../NotificationEntry";
import { NotificationEntrySkeleton } from "../NotificationEntrySkeleton";

const BirthdayReminderNotification = ({
    notification,
    children: _2,
    ...props
}: NotificationEntryTypeProps<NotificationGroup.BIRTHDAY_REMINDER>) => {

    const { t } = useTranslation("notification");

    const { data: { id } } = notification;

    const { data, isFetching, isLoading, isError } = useGetBirthdayQuery(id);

    const notificationTitle = t("birthday_reminder.title");
    const description = t("birthday.body", {
        count: data?.until || 0,
        firstname: data?.birthdayRecord.name.first || "",
        lastname: data?.birthdayRecord.name.last || "",
    });

    if (isError) {
        return null;
    }

    if (isLoading || isFetching) {
        return <NotificationEntrySkeleton/>;
    }

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

export { BirthdayReminderNotification };