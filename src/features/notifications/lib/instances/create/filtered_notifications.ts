import { FilteredArray } from "@/lib/classes/FilteredArray.ts";
import { type SortedArray } from "@/lib/classes/SortedArray.ts";
import { AppNotification } from "@/database/birthalert/notifications/types";
import { DBRecord } from "@/types/db.ts";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";

const createNotificationFilter = (sortedNotifications: SortedArray<AppNotification & DBRecord>) => new FilteredArray<
    SortedArray<AppNotification & DBRecord>,
    (AppNotification & DBRecord),
    NotificationGroup
>(
    sortedNotifications,
    {
        arrayGetter: (array) => {
            return array.array
        },
        addCb: (array, element) => {
            return array.add(element)[0];
        },
        removeCb: (array, element) => {
            const found = array.remove(element)[0];
            if (!found) return -1;
            return found.index;
        },
        filterCb: (element, filter) => {
            return element.group == filter;
        },
        filter: Object
            .values(NotificationGroup)
            .filter(
                (group) => typeof group === "string"
            ) as unknown as NotificationGroup[],
    }
);

export { createNotificationFilter };