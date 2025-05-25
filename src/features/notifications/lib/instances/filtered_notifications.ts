import { createNotificationFilter } from "./create/filtered_notifications";
import { sortedNotifications } from "./sorted_notifications";

const filteredNotifications = createNotificationFilter(sortedNotifications);

export { filteredNotifications };