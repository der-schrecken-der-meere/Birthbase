import { AppStartWorker } from "@/worker/AppStart/controller";
import { NotificationSchedulerWorker } from "@/worker/NotificationScheduler/controller";

/** Load all worker */
const init_workers = () => {
    // Create message channel for communication between initial notification load worker and notification manager worker
    const notification_loader_channel = new MessageChannel();

    // Create workers
    AppStartWorker.create_worker();
    NotificationSchedulerWorker.create_worker();

    // Send ports for communication between workers
    AppStartWorker.send_message({ code: "port" }, [notification_loader_channel.port1]);
    NotificationSchedulerWorker.send_message({ code: "port" }, [notification_loader_channel.port2]);
};

export {
    init_workers,
};