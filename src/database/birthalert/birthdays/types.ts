import type { MidnightTimestamp } from "@/lib/types/date";

type AppBirthday = {
    name: {
        first: string,
        last: string,
    },
    timestamp: MidnightTimestamp,
    reminder: number[],
};

export type { AppBirthday };