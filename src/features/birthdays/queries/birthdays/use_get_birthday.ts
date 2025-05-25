// Packages
import { useQuery, useQueryClient } from "@tanstack/react-query";

// External features
import { birthdayModel } from "@/database/birthalert/birthdays/model";

// Internal features
import type { BirthdayCache } from "../../types/query";
import { BIRHTDAY_QUERY_KEY } from "../../lib/constants/keys/birthday_query";
import { unify_birthday } from "../../lib/fn/unify_birthday";

const useGetBirthdayQuery = (id: number) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [BIRHTDAY_QUERY_KEY, id],
        queryFn: async () => {
            const res = await birthdayModel.readRecords([id]);
            const birthday = unify_birthday(res[0]);
            return birthday;
        },
        initialData: () => {
            return queryClient
                .getQueryData<BirthdayCache>([BIRHTDAY_QUERY_KEY])
                ?.birthdays
                .get(
                    /** @ts-ignore */
                    (arrayItem, newItem) => arrayItem.birthdayRecord.id - newItem.birthdayRecord?.id,
                    { birthdayRecord: { id, } as any }
                )[0]
        }
    })
};

export { useGetBirthdayQuery };