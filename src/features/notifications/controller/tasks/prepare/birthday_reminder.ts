// Packages
import type { Options } from "@tauri-apps/plugin-notification";

// External features
import type { NotificationGroup } from "@/database/birthalert/notifications/enums/group";
import { birthdayModel } from "@/database/birthalert/birthdays/model";
import { days_until_next_birthday } from "@/features/birthdays/lib/fn/next_birthday";

// Internal features
import type { PrepareNotificationFn } from "@/features/notifications/types/prepare";
import { create_default_options } from "@/features/notifications/lib/fn/default_options";

const prepare_birthday_reminder_notification: PrepareNotificationFn<NotificationGroup.BIRTHDAY_REMINDER> = async (
    notification,
    t
) => {
    const { data: { id } } = notification;
    const birthday = await birthdayModel.readRecords([id]);
    const options: Options = create_default_options(
        t,
        "birthday_reminder",
        undefined,
        {
            count: days_until_next_birthday(birthday[0].timestamp),
            firstname: birthday[0].name.first,
            lastname: birthday[0].name.last
        }
    );
    return {
        notification,
        options
    };
};

export { prepare_birthday_reminder_notification };