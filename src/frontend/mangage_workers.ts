import NotificationWorker from "@/features/notify/notification_worker?worker";
import LoaderWorker from "./worker/load_birthdays_worker?worker";
import { AddNotificationRequest, DelNotificationRequest, UpdNotificationRequest } from "@/features/notify/core";
import { on_message as on_loader_msg, Tasks } from "./worker_scripts/load_birthdays";
import { on_message as on_notification_msg } from "@/features/notify/notify";

let notification_worker: Worker|null = null;
let loader_worker: Worker|null = null;
let notification_loader_channel = new MessageChannel();

/** Send a message to the Notification-Worker. Only usable after load_workers */
const send_notification_msg = (
    req: (AddNotificationRequest | DelNotificationRequest | UpdNotificationRequest)[]
) => {
    if (notification_worker) {
        console.log("Sending Message to Notification-Worker:", req);
        notification_worker.postMessage(req);
    }
};

/** Send a message to the Loader-Worker. Only usable after load_workers */
const send_loader_msg = (
    req: { task: Tasks }
) => {
    if (loader_worker) {
        console.log("Sending Message to Loader-Worker:", req);
        loader_worker.postMessage(req);
    }
};

/** Load all worker */
const load_workers = () => {
    // Create message channel for communication between initial notification load worker and notification manager worker
    notification_loader_channel = new MessageChannel();

    notification_worker = new NotificationWorker({ name: "notification" });
    notification_worker.onmessage = on_notification_msg;

    loader_worker = new LoaderWorker({ name: "loader" });
    loader_worker.onmessage = on_loader_msg;

    // Pass ports to the workers for communication
    if (loader_worker) {
        loader_worker.postMessage({ code: "port" }, [notification_loader_channel.port1]);
    }
    if (notification_worker) {
        notification_worker.postMessage({ code: "port" }, [notification_loader_channel.port2]);
    }
};

export {
    send_loader_msg,
    send_notification_msg,
    load_workers,
};