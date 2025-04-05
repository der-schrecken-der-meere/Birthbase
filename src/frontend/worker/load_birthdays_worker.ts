import { get_birthdays_model, upd_birthdays_model } from "@/database/tables/birthday/db_model";
import { NotificationGroupType } from "@/database/tables/notifications/notifications";
// import { get_settings_model } from "@/database/tables/settings/db_model";
import { Action, type AddNotificationRequest } from "@/features/notify/core";
import { calculate_days_until_next_birthday } from "@/lib/functions/birthday";
import { Tasks } from "../worker_scripts/load_birthdays";
import { type Birthday } from "@/database/tables/birthday/birthdays";



const handle_load_birthdays = async () => {
    const upd_birtdays: Birthday[] = [];

    console.log("Handle load birthday");

    const birthdays = await get_birthdays_model();
    const notifications: AddNotificationRequest[] = birthdays.reduce(
        (acc, cur) => {
            const { timestamp, id, name: { first, last }, reminder } = cur;
            const until = calculate_days_until_next_birthday(timestamp);
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
            } else if (reminder.includes(until)) {

                const reminder_index = reminder.findIndex((rem) => rem === until);
                reminder.splice(reminder_index, 1);

                upd_birtdays.push({
                    id,
                    name: {
                        first,
                        last
                    },
                    timestamp,
                    reminder
                });

                const reminder_timestamp = new Date(timestamp);
                reminder_timestamp.setUTCDate(reminder_timestamp.getUTCDate() - until);
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
        console.log(r);
    }

    return notifications;
};

let WorkerPort: MessagePort;

self.onmessage = async (
    { data: { task, code }, ports }: MessageEvent<{ task: Tasks, code?: "port" }>
) => {
    if (code === "port") {
        WorkerPort = ports[0];
        return;
    }
    console.log("3");
    switch (task) {
        case Tasks.LOAD_BIRTHDAYS:
            const data = await handle_load_birthdays();
            if (WorkerPort) {
                WorkerPort.postMessage(data);
            }
            break;
    }
};

// Logging
// setInterval(() => {
//     console.log(a);
// }, 1_000);