import { z, type ZodType } from "zod";

import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type UseSettingsFormProps<T, T1 extends ZodType<any, any, any>> = {
    form_schema: T1,
    on_submit: (data: z.infer<T1>) => T | void,
};

type UseForm<T1 extends ZodType<any, any, any>> = {
    form_schema: T1,
    default_values: z.infer<T1>,
};

const useForm = <T1 extends ZodType<any, any, any>>({
    form_schema,
    default_values,
}: UseForm<T1>) => {
    const form = useHookForm<z.infer<T1>>({
        resolver: zodResolver(form_schema),
        defaultValues: default_values,
    });

    return {
        form,
    };
};

export type {
    UseSettingsFormProps,
    UseForm,
};
export {
    useForm,
};