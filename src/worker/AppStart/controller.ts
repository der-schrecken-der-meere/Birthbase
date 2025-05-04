import type { Request } from "./type";
import { WorkerController } from "@/lib/util/classes/WorkerController";
import Worker from "./worker?worker";

const AppStartWorker = new WorkerController<Request, {}>(
    () => new Worker({ name: "AppStartWorker" }),
    (ev) => {
        console.log("AppStartWorker Response: ", ev.data);
    },
    (ev) => {
        console.error("AppStartWorker Error: ", ev);
    },
);

export { AppStartWorker };