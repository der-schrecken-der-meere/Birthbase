import { Birthday } from "@/database/tables/birthday/birthdays";
import { add_birthday_query, del_birthday_query, upd_birthday_query } from "@/features/manage_birthdays/query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { open_confirm } from "./use_app_confirm";
import { create_toast, ToastType } from "./use_app_toast";
import { MutateOptions } from "@tanstack/react-query";

type MutationCallbacks = {
    onSuccess?: () => void,
    onError?: () => void, 
};

const use_birthday_mutation = ({
    remove,
    update,
    add,
}: {
    remove?: MutationCallbacks,
    update?: MutationCallbacks,
    add?: MutationCallbacks,
}) => {
    const { mutate: remove_query } = del_birthday_query();
    const { mutate: update_query } = upd_birthday_query();
    const { mutate: add_query } = add_birthday_query();

    const { t } = useTranslation(["generally", "toast", "confirm"]);

    const titles = useMemo(() => {
        return {
            error: t("error", { ns: "generally" }),
            success: t("success", { ns: "generally" })
        };
    }, [t]);

    const mutation_options = useCallback(<T, T2>(
        success_descr: string,
        error_descr: string,
        cbs?: MutationCallbacks
    ): MutateOptions<T, Error, T2, unknown> => {
        return {
            onSuccess: () => {
                create_toast({
                    title: titles.success,
                    description: success_descr,
                }, ToastType.SUCCESS);
                if (cbs?.onSuccess) cbs.onSuccess();
            },
            onError: (error) => {
                console.error(error);
                create_toast({
                    title: titles.error,
                    description: error_descr,
                }, ToastType.ERROR);
                if (cbs?.onError) cbs.onError();
            }
        };
    }, [titles]);

    const delete_birthday = useCallback((birthday: Birthday) => {
        open_confirm({
            title: t("sure", { ns: "confirm" }),
            description: t("msgs.delete_birthday", { ns: "confirm" }),
            on_confirm: async () => {
                remove_query(birthday, mutation_options(
                    t("success.delete_birthday", { ns: "toast" }),
                    t("errors.delete_birthday", { ns: "toast" }),
                    remove
                ))
            }
        });
    }, [mutation_options, t, remove]);

    const update_birthday = useCallback((birthday: Birthday) => {
        update_query(birthday, mutation_options(
            t("success.change_birthday", { ns: "toast" }),
            t("errors.change_birthday", { ns: "toast" }),
            update
        ))
    }, [mutation_options, t, update]);

    const add_birthday = useCallback((birthday: Birthday) => {
        add_query(birthday, mutation_options(
            t("success.save_birthday", { ns: "toast" }),
            t("errors.save_birthday", { ns: "toast" }),
            add
        ))
    }, [mutation_options, t, add]);

    return {
        delete_birthday,
        update_birthday,
        add_birthday,
    };
};

export { use_birthday_mutation };