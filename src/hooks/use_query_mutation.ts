// Packages
import { MutateOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// Extern features
import { useToastStore } from "@/stores/appToast/store";
import { AppToastType } from "@/stores/appToast/lib/enum/type";

// Internal features
import { QueryMutationOptions } from "./types/use_query_mutation";

const useQueryMutation = <TData, TVariables>(
    errorKey: string,
    options?: QueryMutationOptions
): MutateOptions<TData, Error, TVariables, unknown> => {

    // Constants
    const namespaces = ["generally", "error"];
    if (options?.successToast) {
        namespaces.push("success");
    }

    // Stores
    const setToast = useToastStore((state) => state.setToast);

    // Hooks
    const { t } = useTranslation(["generally", "error"]);

    return {
        onSuccess: () => {
            if (options?.successToast) {
                setToast({
                    title: t("success"),
                    description: t(options.successToast, { ns: "success" }),
                }, AppToastType.SUCCESS);
            }
            if (options?.onSuccess) options.onSuccess();
        },
        onError: (error) => {
            console.error(error);
            setToast({
                title: t("error"),
                description: t(errorKey, { ns: "error" }),
            }, AppToastType.ERROR);
            if (options?.onError) options.onError();
        },
    };
};

export { useQueryMutation };