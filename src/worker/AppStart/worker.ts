// import { get_settings_model } from "@/database/tables/settings/db_model";
// import { Action, type AddNotificationRequest } from "@/features/notify/core";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";
// import { Tasks } from "./../frontend/worker_scripts/load_birthdays";
import { type Birthday } from "@/database/tables/birthday/birthdays";
import { WorkerRequest } from "./type";
import { Tasks } from "@/frontend/worker_scripts/load_birthdays";
import { midnight_utc } from "@/lib/functions/date";
import { WorkerWrapper } from "@/lib/classes/WorkerWrapper";
import type { CreateNotification } from "@/features/notifications/types/worker";
import { birthdayModel } from "@/database/birthalert/birthdays/model";
import { DataOperation } from "@/lib/constants/enums/data_operation";
import { NotificationGroup } from "@/database/birthalert/notifications/enums/group";

new WorkerWrapper<WorkerRequest, {}>(async function({ task }) {
    switch (task) {
        case Tasks.LOAD_BIRTHDAYS:
            const data = await handle_load_birthdays();
            if (this.port) {
                console.log("Send notifications to NotificationScheduler", data);
                this.port.postMessage({ tasks: data });
                this.postMessage("finished");
            }
            break;
        default:
            break;
    }
});

const handle_load_birthdays = async () => {
    /** Birthdays that will be updated in db */
    const upd_birtdays: Birthday[] = [];

    // Get all birthdays from db
    const birthdays = await birthdayModel.readAllRecords();

    /** All notifications that will be triggerd */
    const notifications: CreateNotification[] = birthdays.reduce(
        (acc, cur) => {
            const { timestamp, id, name: { first, last }, reminder } = cur;

            // Get days until next birthday
            const until = calculate_days_until_next_birthday(timestamp);

            // Birthday is today
            if (until === 0) {
                acc.push({
                    action: DataOperation.CREATE,
                    new_data: {
                        group: NotificationGroup.BIRTHDAY,
                        timestamp,
                        data: {
                            id,
                        }
                    }
                });
            // Reminder shall call today
            } else if (reminder.includes(until)) {
                // Remove reminder from reminder array,
                // so it will not be triggered again today
                const reminder_index = reminder.findIndex((rem) => rem === until);
                reminder.splice(reminder_index, 1);

                // Add birthday without the reminder for today to update array
                upd_birtdays.push({
                    id,
                    name: {
                        first,
                        last
                    },
                    timestamp,
                    reminder
                });

                // Get the current data as midnight timestamp
                const reminder_timestamp = midnight_utc(Date.now());

                acc.push({
                    action: DataOperation.CREATE,
                    new_data: {
                        group: NotificationGroup.BIRTHDAY_REMINDER,
                        timestamp: +reminder_timestamp,
                        data: {
                            id,
                        }
                    }
                })
            }
            return acc;
        },
        [] as CreateNotification[],
    );

    if (upd_birtdays.length > 0) {
        const r = await birthdayModel.updateRecords(upd_birtdays);
    }

    return notifications;
};

// Logging
// setInterval(() => {
//     console.log(a);
// }, 1_000);