import { type DefinedUseQueryResult } from "@tanstack/react-query";

import { z, type ZodType } from "zod";

import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "./use_query";

type UseSettingsFormProps<T, T1 extends ZodType<any, any, any>> = {
    form_schema: T1,
    on_submit: (data: z.infer<T1>) => T | void,
};

type UseForm<T, T1 extends ZodType<any, any, any>> = {
    form_schema: T1,
    key: string,
    default_values: z.infer<T1>,
    get_query: () => DefinedUseQueryResult<T, Error>,
    dynamic?: boolean
};

const useForm = <T, T1 extends ZodType<any, any, any>>({
    form_schema,
    key,
    default_values,
    get_query,
    dynamic
}: UseForm<T, T1>) => {
    const { data, isFetching } = useQuery({
        tKey: key,
        useQueryFn: get_query,
    });

    const formOptions: any = {
        resolver: zodResolver(form_schema),
        defaultValues: default_values,
    };
    if (dynamic) {
        formOptions["values"] = data;
    }

    const form = useHookForm<z.infer<T1>>(formOptions);

    return {
        form,
        isFetching,
        data
    };
};

export type {
    UseSettingsFormProps,
    UseForm,
};
export {
    useForm,
};