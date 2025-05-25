import { useErrorQuery } from "@/hooks/core/use_query";
import { useGetNotificationsQuery } from "../queries/notifications/use_get_notifications";
import { useNotificationMutation } from "../hooks/use_notification_mutation";
import { useState } from "react";
import { AppNotification } from "@/database/birthalert/notifications/types";
import { DBRecord } from "@/lib/types/db";
import { NotificationFilterHeader } from "./NotificationFilterHeader";
import { useTranslation } from "react-i18next";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { NotificationList } from "./NotificationList";
import { NotificationEntrySkeleton } from "./NotificationEntrySkeleton";

const NotificationPage = () => {

    // Hooks
    const { data: { filter }, isFetching } = useErrorQuery({
        useQueryFn: useGetNotificationsQuery,
        tKey: "notify.show",
    });
    const { deleteNotification, updateNotification } = useNotificationMutation();
    const { t } = useTranslation("pages");

    const [ filterIndex, setFilterIndex ] = useState(0);
    const [ filterData, setFilterData ] = useState<(AppNotification & DBRecord)[]>([]);

    const onDelete = (notification: AppNotification & DBRecord) => {
        deleteNotification(notification);
    };

    const onRead = (notification: AppNotification & DBRecord) => {
        updateNotification({ ...notification, read: true });
    };

    const notificationFilters = [
        {
            onClick: () => {
                setFilterIndex(0);
                setFilterData(filter.array.array);
            },
            text: t("notifications.all"),
        },
        {
            onClick: () => {
                setFilterIndex(1);
                setFilterData(filter.getFilter(NotificationGroup.BIRTHDAY) || []);
            },
            text: t("notifications.birthday", { count: 2 }),
        },
        {
            onClick: () => {
                setFilterIndex(2);
                setFilterData(filter.getFilter(NotificationGroup.BIRTHDAY_REMINDER) || []);
            },
            text: t("notifications.reminder", { count: 2 }),
        },
        {
            onClick: () => {
                setFilterIndex(3);
                setFilterData(filter.getFilter(NotificationGroup.INFO) || []);
            },
            text: t("notifications.info", { count: 2 }),
        },
    ];

    if (isFetching) {
        return <NotificationEntrySkeleton/>;
    }

    return (
        <>
            <NotificationFilterHeader
                activeFilterIndex={filterIndex}
                filters={notificationFilters}
            />
            <NotificationList
                notifications={filterData}
                onDelete={onDelete}
                onRead={onRead}
            />
        </>
    );
};

export { NotificationPage };