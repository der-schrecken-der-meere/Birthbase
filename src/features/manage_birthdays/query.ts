import type { Birthday } from "../../database/tables/birthday/birthdays";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../../database/db";
import { get_birthday_model } from "../../database/tables/birthday/db_model";
import {
    add_sorted_birthdays,
    upd_sorted_birthdays,
    del_sorted_birthdays,
} from "./sort";
import {
    add_birthday_middleware,
    upd_birthday_middleware,
    del_birthday_middleware,
    clear_birthday_middleware,
} from "@/middleware/birthday";


// Contants
const c_query_key = "birthdays";



// Functions
const get_birthdays_query = () => {
    return useQuery({
        queryKey: [c_query_key],
        queryFn: () => {
            return db.get_sorted_birthdays();
        },
        initialData: [],
    });
};

const get_birthday_query = (id: number) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [c_query_key, id],
        queryFn: () => {
            return get_birthday_model(id);
        },
        initialData: () => {
            return queryClient.getQueryData<Birthday[]>([c_query_key])?.find(birthday => birthday.id === +id);
        },
    })
}

const add_birthday_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (birthday: Birthday) => {
            return add_birthday_middleware(birthday) as Promise<Birthday>;
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Birthday[]>([c_query_key], (oldData) => {
                if (!oldData) return [data];
                return add_sorted_birthdays(oldData, data);
            });
        }
    })
}

const upd_birthday_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (birthday: Birthday)=> {
            return upd_birthday_middleware(birthday) as Promise<Birthday>;
        },
        onSuccess: (newBirthday) => {
            queryClient.setQueryData<Birthday[]>([c_query_key], (oldData) => {
                if (!oldData) return [newBirthday];
                return upd_sorted_birthdays(oldData, newBirthday);
            });
        }
    });
}

const del_birthday_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (birthday: Birthday) => {
            return del_birthday_middleware(birthday);
        },
        onSuccess: (deletedBirthdayIndex) => {
            queryClient.setQueryData<Birthday[]>([c_query_key], (oldData) => {
                if (!oldData) return [];
                return del_sorted_birthdays(oldData, deletedBirthdayIndex);
            });
        }
    })
};

const clear_birthday_query = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return clear_birthday_middleware();
        },
        onSuccess: () => {
            queryClient.setQueryData<Birthday[]>([c_query_key], () => []);
        }
    })
};

export {
    get_birthday_query,
    get_birthdays_query,
    add_birthday_query,
    upd_birthday_query,
    del_birthday_query,
    clear_birthday_query,
};