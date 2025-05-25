import { type Tasks } from "@/frontend/worker_scripts/load_birthdays";

type WorkerRequest = {
    task?: Tasks
};

export type { WorkerRequest };