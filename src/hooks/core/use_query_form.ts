import { type DefinedUseQueryResult } from "@tanstack/react-query";

import { z, type ZodType } from "zod";

import { UseFormProps, useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "./use_query";

type UseQueryForm<T, T1 extends ZodType<any, any, any>> = Omit<UseFormProps, "resolver" | "defaultValues" | "values"> &{
    formSchema: T1,
    tKey: string,
    defaultValues: z.infer<T1>,
    useQueryFn: () => DefinedUseQueryResult<T, Error>,
    reducer: (data: T) => z.infer<T1>,
};

const useQueryForm = <T, T1 extends ZodType<any, any, any>>({
    formSchema,
    tKey,
    defaultValues,
    useQueryFn,
    reducer,
    ...formHookProps
}: UseQueryForm<T, T1>) => {
    const { data, ...props } = useQuery({
        tKey,
        useQueryFn,
    });

    const values = reducer(data);

    /** @ts-ignore `formHookProps` has optional params, that are only filled if they passed explicitly */
    const form = useHookForm<z.infer<T1>>({
        resolver: zodResolver(formSchema),
        defaultValues,
        values,
        ...formHookProps
    });

    return {
        form,
        data: values,
        ...props,
    };
};

export type {
    UseQueryForm,
};
export {
    useQueryForm,
};