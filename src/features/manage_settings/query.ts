import { get_settings_model } from "@/database/tables/settings/db_model";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { clear_settings_middleware, set_settings_middleware, unset_settings_middleware } from "@/middleware/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Constants
const c_query_key = "settings";



// Functions
const useGetSettingsQuery = () => {
    return useQuery({
        queryKey: [c_query_key],
        queryFn: () => {
            return get_settings_model();
        },
        initialData: get_default_settings(),
    });
};

const useUnsetSettingsQuery = () => {
    const obj_query_client = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return unset_settings_middleware()
        },
        onSuccess: (data) => {
            obj_query_client.setQueryData<Settings>([c_query_key], () => {
                return data;
            });
        },
    });
};

const useSetSettingsQuery = () => {
    const obj_query_client = useQueryClient();
    return useMutation({
        mutationFn: (settings: Partial<Settings>) => {
            return set_settings_middleware(settings);
        },
        onSuccess: (new_settings) => {
            obj_query_client.setQueryData<Settings>([c_query_key], () => {
                return new_settings;
            })
        },
    });
};

const useClearSettingsQuery = () => {
    const obj_query_client = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return clear_settings_middleware();
        },
        onSuccess: (default_settings) => {
            obj_query_client.setQueryData<Settings>([c_query_key], () => default_settings)
        }
    });
};

export {
    useGetSettingsQuery,
    useSetSettingsQuery,
    useClearSettingsQuery,
    useUnsetSettingsQuery,
};