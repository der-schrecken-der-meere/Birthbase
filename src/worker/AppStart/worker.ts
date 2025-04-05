import { get_birthdays_model, upd_birthdays_model } from "@/database/tables/birthday/db_model";
import { NotificationGroupType } from "@/database/tables/notifications/notifications";
// import { get_settings_model } from "@/database/tables/settings/db_model";
import { Action, type AddNotificationRequest } from "@/features/notify/core";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";
// import { Tasks } from "./../frontend/worker_scripts/load_birthdays";
import { type Birthday } from "@/database/tables/birthday/birthdays";
import { Request } from "./type";
import { Tasks } from "@/frontend/worker_scripts/load_birthdays";
import { midnight_utc } from "@/lib/functions/date";



const handle_load_birthdays = async () => {
    /** Birthdays that will be updated in db */
    const upd_birtdays: Birthday[] = [];

    // Get all birthdays from db
    const birthdays = await get_birthdays_model();

    /** All notifications that will be triggerd */
    const notifications: AddNotificationRequest[] = birthdays.reduce(
        (acc, cur) => {
            const { timestamp, id, name: { first, last }, reminder } = cur;

            // Get days until next birthday
            const until = calculate_days_until_next_birthday(timestamp);

            // Birthday is today
            if (until === 0) {
                acc.push({
                    action: Action.ADD,
                    id,
                    new_data: {
                        group_type: NotificationGroupType.BIRTHDAY,
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
                    action: Action.ADD,
                    id,
                    new_data: {
                        group_type: NotificationGroupType.BIRTHDAY_REMINDER,
                        timestamp: +reminder_timestamp,
                        data: {
                            id,
                        }
                    }
                })
            }
            return acc;
        },
        [] as AddNotificationRequest[],
    );

    if (upd_birtdays.length > 0) {
        const r = await upd_birthdays_model(upd_birtdays);
        console.log("Updated birthdays: ", r);
    }

    return notifications;
};

let WorkerPort: MessagePort;

self.onmessage = async (
    { data, ports }: MessageEvent<Request>
) => {
    console.log("AppStartWorker Request:", data);
    const { code, task } = data;

    // Set worker port
    if (code === "port") {
        WorkerPort = ports[0];
        return;
    }

    switch (task) {
        case Tasks.LOAD_BIRTHDAYS:
            // Get all birthdays or reminder that will trigger now
            const data = await handle_load_birthdays();
            if (WorkerPort) {
                WorkerPort.postMessage({ tasks: data});
            }
            break;
    }
};

// Logging
// setInterval(() => {
//     console.log(a);
// }, 1_000);