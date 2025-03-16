import { type Birthday } from "@/database/tables/birthday/birthdays";

import { useMutation, type UseMutationProps, type UseMutationReturn } from "./core/use_mutation";

import { useAddBirthdayQuery, useDelBirthdayQuery, useUpdBirthdayQuery } from "@/features/manage_birthdays/query";
import { useTranslation } from "react-i18next";
import { useConfirmStore } from "../stores/use_confirm_store";

const useBirthdayMutation = ({
    del_cbs,
    upd_cbs,
    add_cbs,
}: UseMutationProps): UseMutationReturn<Birthday> => {
    const { mutateAsync: remove_query } = useDelBirthdayQuery();
    const { mutateAsync: update_query } = useUpdBirthdayQuery();
    const { mutateAsync: add_query } = useAddBirthdayQuery();

    const { t } = useTranslation(["toast", "confirm"]);

    const { mutation_options } = useMutation();

    const setConfirm = useConfirmStore((state) => state.setConfirm);

    const del = async (birthday: Birthday) => {
        setConfirm({
            title: t("sure", { ns: "confirm" }),
            description: t("msgs.delete_birthday", { ns: "confirm" }),
            on_confirm: async () => {
                await remove_query(birthday, mutation_options(
                    "delete",
                    "birthday",
                    del_cbs
                ));
            },
        });
    };

    const upd = async (birthday: Birthday) => {
        await update_query(birthday, mutation_options(
            "update",
            "birthday",
            upd_cbs
        ));
    };

    const add = async (birthday: Birthday) => {
        await add_query(birthday, mutation_options(
            "add",
            "birthday",
            add_cbs
        ));
    };

    return {
        del,
        upd,
        add,
    };
};

export {
    useBirthdayMutation,
};