// External features
import { MidnightTimestamp } from "@/lib/types/date";

// Internal features
import { AppBirthday } from "./types";

const create_default_birthday = (): AppBirthday => {
    return {
        name: {
            first: "",
            last: "",
        },
        reminder: [],
        timestamp: Date.now() as MidnightTimestamp,
    }
};

export { create_default_birthday };