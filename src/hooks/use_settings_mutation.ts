import { Settings } from "@/database/tables/settings/settings";
import { useMutation, UseMutationProps, UseMutationReturn } from "./core/use_mutation";
import { useSetSettingsQuery, useUnsetSettingsQuery } from "@/features/settings/query";

const useSettingsMutation = ({
    add_cbs,
    upd_cbs,
    del_cbs,
}: UseMutationProps): UseMutationReturn<Partial<Settings>> => {
    const { mutateAsync: add_query } = useSetSettingsQuery();
    const { mutateAsync: upd_query } = useSetSettingsQuery();
    const { mutateAsync: del_query } = useUnsetSettingsQuery();

    const { mutation_options } = useMutation();

    const del = async () => {
        await del_query(undefined, mutation_options(
            "delete",
            "settings",
            del_cbs,
        ));
    };

    const add = async (settings: Partial<Settings>) => {
        await add_query(settings, mutation_options(
            "add",
            "settings",
            add_cbs,
        ));
    };

    const upd = async (settings: Partial<Settings>) => {
        await upd_query(settings, mutation_options(
            "update",
            "settings",
            upd_cbs,
        ));
    };

    return {
        add,
        upd,
        del,
    };
};

export {
    useSettingsMutation,
};