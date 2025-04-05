import { type Tasks } from "@/frontend/worker_scripts/load_birthdays";

type Request = {
    code?: "port"
    task?: Tasks
};

export type { Request };