import type { Settings } from "@/database/tables/settings/type";
import { useGetSettingsQuery } from "@/features/settings/query";
import { z, ZodType } from "zod";
import { get_default_settings } from "@/database/tables/settings/settings";
import { useSettingsMutation } from "./use_settings_mutation";
import { useQueryForm } from "./core/use_query_form";

type UseSettingsFormProps<T, T1 extends ZodType<any, any, any>> = {
    /** Zod form schema */
    formSchema: T1,
    /** A function that decides whether the values should be uploaded to the db */
    checkSubmitValues: (data: z.infer<T1>) => Partial<T> | void,
    /** A function that reduces the settings object to only the necessary fields */
    reducer: (data: T) => z.infer<T1>,
};

const useSettingsForm = <T extends ZodType<any, any, any>>({
    formSchema,
    checkSubmitValues,
    reducer,
}: UseSettingsFormProps<Omit<Settings, "id">, T>) => {
    const { upd } = useSettingsMutation({
        upd_cbs: {
            successToast: true,
        },
    });

    const { ...props } = useQueryForm({
        defaultValues: reducer(get_default_settings()),
        formSchema,
        tKey: "settings",
        useQueryFn: useGetSettingsQuery,
        reducer,
    });

    const onSubmit = async (data: z.infer<T>) => {
        const new_settings = checkSubmitValues(data);
        if (new_settings) {
            await upd(new_settings);
        }
    };

    return {
        onSubmit,
        ...props
    };
};

export { useSettingsForm };