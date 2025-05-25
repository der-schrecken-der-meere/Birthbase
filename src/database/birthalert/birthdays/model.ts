// External features
import { Model } from "@/lib/classes/Model";
import { birthAlert } from "@/database/lib/instances/birthAlert";
import { TABLES } from "@/database/lib/enums/tables";

// Internal features
import type { AppBirthday } from "./types";

const birthdayModel = new Model<AppBirthday, AppBirthday>(
    TABLES.BIRTHDAYS,
    birthAlert,
);

export { birthdayModel };