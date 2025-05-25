import type { WorkerRequest } from "./type";
import { WorkerController } from "@/lib/classes/WorkerController";
import Worker from "./worker?worker";

const appStartWorker = new WorkerController<WorkerRequest, {}>(
    () => new Worker({ name: "AppStartWorker" }),
    function (ev) {
        console.log("AppStartWorker Response: ", ev);
        this.kill_worker();
    },
    (ev) => {
        console.error("AppStartWorker Error: ", ev);
    },
);

export { appStartWorker };