// External features
import { Model } from "@/lib/classes/Model";
import { birthAlert } from "@/database/lib/instances/birthAlert";
import { TABLES } from "@/database/lib/enums/tables";

// Internal features
import type { AppNotification } from "./types";

const notificationModel = new Model<AppNotification, AppNotification>(
    TABLES.NOTIFICATIONS,
    birthAlert,
);

export { notificationModel };