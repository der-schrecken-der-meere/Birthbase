import { type MutateOptions } from "@tanstack/react-query";

import { ToastType, useToastStore } from "../../stores/use_toast_store";
import { useTranslation } from "react-i18next";

type UseMutationProps = {
    del_cbs?: MutationCallbacks,
    upd_cbs?: MutationCallbacks,
    add_cbs?: MutationCallbacks,
};

type UseMutationReturn<T> = {
    del: (data: T) => Promise<void>,
    upd: (data: T) => Promise<void>,
    add: (data: T) => Promise<void>,
};

type MutationCallbacks = {
    onSuccess?: () => void,
    onError?: () => void, 
    successToast?: boolean,
};

const useMutation = () => {
    const { t } = useTranslation(["generally", "toast"]);
    const setToast = useToastStore((state) => state.setToast);
    const ts = (key: string) => {
        return t(key, { ns: "toast" });
    };

    const mutation_options = <T, T2>(
        operation: string,
        key: string,
        cbs?: MutationCallbacks
    ): MutateOptions<T, Error, T2, unknown> => {
        return {
            onSuccess: () => {
                if (cbs?.successToast) {
                    setToast({
                        title: t("success"),
                        description: ts(`success.${operation}.${key}`),
                    }, ToastType.SUCCESS);
                }
                if (cbs?.onSuccess) cbs.onSuccess();
            },
            onError: (error) => {
                console.error(error);
                setToast({
                    title: t("error"),
                    description: ts(`errors.${operation}.${key}`),
                }, ToastType.ERROR);
                if (cbs?.onError) cbs.onError();
            }
        };
    };

    return {
        mutation_options,
    };
};

export type {
    MutationCallbacks,
    UseMutationProps,
    UseMutationReturn,
};
export {
    useMutation,
};