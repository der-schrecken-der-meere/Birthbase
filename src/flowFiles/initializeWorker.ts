import { notificationSchedulerWorker } from "@/features/notifications/controller/controller";
import { appStartWorker } from "@/worker/AppStart/controller";

const notificationStarterChannel = new MessageChannel();

// Create AppStart- and NotificationSchedulerWorker to ensure
// they are ready to receive jobs
appStartWorker.create_worker();
notificationSchedulerWorker.create_worker();

appStartWorker.send_message({}, [notificationStarterChannel.port1]);
notificationSchedulerWorker.send_message({ tasks: [] }, [notificationStarterChannel.port2]);