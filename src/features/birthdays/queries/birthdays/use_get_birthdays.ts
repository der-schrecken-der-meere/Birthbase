// Packages
import { useQuery } from "@tanstack/react-query";

// External features
import { birthdayModel } from "@/database/birthalert/birthdays/model";

// Internal features
import { BIRHTDAY_QUERY_KEY } from "../../lib/constants/keys/birthday_query";
import { unify_birthday } from "../../lib/fn/unify_birthday";
import { createBirthdayCache } from "./cache";

const useGetBirthdaysQuery = () => {
    return useQuery({
        queryKey: [BIRHTDAY_QUERY_KEY],
        queryFn: async () => {
            const res = await birthdayModel.readAllRecords();
            const mapped = res.map((birthday) => unify_birthday(birthday));
            const cache = createBirthdayCache(mapped);
            return cache;
        },
        initialData: createBirthdayCache(),
    })
};

export { useGetBirthdaysQuery };