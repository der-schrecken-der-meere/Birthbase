import { DefinedUseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToastStore, ToastType } from "../../stores/use_toast_store";
import { useTranslation } from "react-i18next";

type UseQueryProps<T> = {
    useQueryFn: () => DefinedUseQueryResult<T, Error>,
    tKey: string,
};

const useQuery = <T>({
    useQueryFn,
    tKey,
}: UseQueryProps<T>) => {

    const setToast = useToastStore((state) => state.setToast);
    const { t } = useTranslation(["toast", "generally"]);
    
    const { data, isFetching, error, isError } = useQueryFn();
    
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
        data,
        isFetching,
    };
};

export {
    useQuery,
};