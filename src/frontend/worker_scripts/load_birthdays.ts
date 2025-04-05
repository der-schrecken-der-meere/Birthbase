import { AddNotificationRequest } from "@/features/notify/core";

enum Tasks {
    LOAD_BIRTHDAYS
};

enum WorkerResponse {
    FINISH
};

const on_message = (e: MessageEvent<{response: WorkerResponse, data?: AddNotificationRequest[]}>) => {
    console.log(e);
};

export {
    on_message,
    Tasks,
    WorkerResponse
};