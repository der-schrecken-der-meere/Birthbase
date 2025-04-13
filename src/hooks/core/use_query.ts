import { DefinedUseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToastStore, ToastType } from "../../stores/use_toast_store";
import { useTranslation } from "react-i18next";

type UseQueryProps<T> = {
    /** Query function that will return the data */
    useQueryFn: () => DefinedUseQueryResult<T, Error>,
    /** Translation key for the error message
     * 
     * `test => errors.show.test`
     */
    tKey: string,
};

const useQuery = <T>({
    useQueryFn,
    tKey,
}: UseQueryProps<T>) => {

    const setToast = useToastStore((state) => state.setToast);
    const { t } = useTranslation(["toast", "generally"]);
    
    const {
        error,
        errorUpdateCount,
        errorUpdatedAt,
        failureCount,
        failureReason,
        isError,
        isLoadingError,
        isRefetchError,
        ...props
    } = useQueryFn();
    
    useEffect(() => {
        if (isError) {
            console.error(error);
            setToast({
                title: t("error", { ns: "generally" }),
                description:t(`errors.show.${tKey}`),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    return {
        ...props
    };
};

export {
    useQuery,
};