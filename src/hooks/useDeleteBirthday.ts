import { del_birthday_query } from "@/features/manage_birthdays/query";
import { useCallback } from "react";
import { Birthday } from "@/database/tables/birthday/birthdays";
import { create_toast, ToastType } from "./use_app_toast";
import { open_confirm } from "./use_app_confirm";

const useDeleteBirthdays = ({
    onSuccess,
    onError,
}: {
    onSuccess?: () => void,
    onError?: () => void,
}) => {
    const { mutate: remove } = del_birthday_query();

    const deleteBirthday = useCallback((birthday: Birthday) => {
        open_confirm({
            title: "Sind Sie wirklich sicher?",
            description: "Der Geburtstag wird gelöscht und danach nicht mehr angezeigt.",
            on_confirm: async () => {
                remove(birthday, {
                    onSuccess: () => {
                        create_toast({
                            title: "Erfolgreich",
                            description: "Der Geburtstag wurde gelöscht",
                        }, ToastType.SUCCESS);
                        if (onSuccess) onSuccess();
                    },
                    onError: (error) => {
                        create_toast({
                            title: "Fehler beim Löschen des Geburtstages",
                            description: JSON.stringify(error),
                        }, ToastType.ERROR);
                        if (onError) onError();
                    }
                })
            }
        })
    }, []);

    return {
        deleteBirthday,
    }
}

export { useDeleteBirthdays };