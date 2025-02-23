import { get_settings_query, set_settings_query } from "@/features/manage_settings/query";
import { useCallback, useEffect } from "react";
import { create_toast, ToastType } from "./use_app_toast";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { useTranslation } from "react-i18next";

type UseSettingsFormProps<T extends ZodType<any, any, any>> = {
    form_schema: T,
    on_submit: (data: z.infer<T>) => Partial<Settings> | void,
};

const use_settings_form = <T extends ZodType<any, any, any>>({
    form_schema,
    on_submit,
}: UseSettingsFormProps<T>) => {
    const { data, isError, error, isFetching } = get_settings_query();
    const { mutateAsync: update } = set_settings_query();
    const { t } = useTranslation(["toast", "generally"]);

    const form = useForm<z.infer<T>>({
        resolver: zodResolver(form_schema),
        defaultValues: (() => {
            const default_settings = get_default_settings();
            return default_settings as z.infer<T>;
        })(),
        values: data,
    });

    const onSubmit = useCallback(async (data: z.infer<T>) => {
        const new_settings = on_submit(data);
        if (new_settings) {
            await update(new_settings, {
                onSuccess: () => {
                    create_toast({
                        title: t("success", { ns: "generally" }),
                        description: t("success.change_settings"),
                    }, ToastType.SUCCESS);
                },
                onError: (error) => {
                    console.error(error);
                    create_toast({
                        title: t("error", { ns: "error" }),
                        description: t("error.change_settings"), 
                    }, ToastType.ERROR);
                },
            });
        }
    }, [on_submit]);

    useEffect(() => {
        if (isError) {
            create_toast({
                title: t("error", { ns: "generally" }),
                description: t("error.show_settings"),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    return {
        isFetching,
        form,
        onSubmit,
        data
    };
};

export { use_settings_form };