import type { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import type { AppNotification } from "@/database/birthalert/notifications/types";
import type { FilteredArray } from "@/lib/classes/FilteredArray";
import type { SortedArray } from "@/lib/classes/SortedArray";
import type { DBRecord } from "@/types/db";

type NotificationQueueChache = {
    filter: FilteredArray<
        SortedArray<AppNotification & DBRecord>,
        (AppNotification & DBRecord),
        NotificationGroup
    >
    /** How many notifications are not read */
    not_read: number,
};

export type {
    NotificationQueueChache
};