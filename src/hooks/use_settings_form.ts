import { useGetSettingsQuery } from "@/features/manage_settings/query";
import { z, ZodType } from "zod";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { useSettingsMutation } from "./use_settings_mutation";
import { useForm, UseSettingsFormProps } from "./core/use_form";

const useSettingsForm = <T extends ZodType<any, any, any>>({
    form_schema,
    on_submit,
}: UseSettingsFormProps<Partial<Settings>, T>) => {
    const { upd } = useSettingsMutation({
        upd_cbs: {
            successToast: true
        }
    });
    const { form, isFetching, data } = useForm({
        default_values: get_default_settings(),
        form_schema,
        key: "settings",
        get_query: useGetSettingsQuery,
        dynamic: true,
    });

    const onSubmit = async (data: z.infer<T>) => {
        const new_settings = on_submit(data);
        if (new_settings) {
            await upd(new_settings);
        }
    };

    return {
        isFetching,
        form,
        onSubmit,
        data
    };
};

export { useSettingsForm };