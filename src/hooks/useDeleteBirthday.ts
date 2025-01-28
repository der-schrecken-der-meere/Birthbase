import { del_birthday_query } from "@/features/manage_birthdays/query";
import { useCallback } from "react";
import { useAppToast } from "./useAppToast";
import { useConfirmDialog } from "./useConfirmDialog";
import { Birthday } from "@/database/tables/birthday/birthdays";

const useDeleteBirthdays = ({
    onSuccess,
    onError,
}: {
    onSuccess?: () => void,
    onError?: () => void,
}) => {
    const { setErrorNotification, setSuccessNotification } = useAppToast();
    const { mutate: remove } = del_birthday_query();
    const { setConfirm } = useConfirmDialog();

    const deleteBirthday = useCallback((birthday: Birthday) => {
        setConfirm({
            title: "Sind Sie wirklich sicher?",
            description: "Der Geburtstag wird gelöscht und danach nicht mehr angezeigt.",
            onConfirm: async () => {
                remove(birthday, {
                    onSuccess: () => {
                        setSuccessNotification({
                            title: "Erfolgreich",
                            description: "Der Geburtstag wurde gelöscht",
                        })
                        if (onSuccess) onSuccess();
                    },
                    onError: (error) => {
                        setErrorNotification({
                            title: "Fehler beim Löschen des Geburtstages",
                            description: JSON.stringify(error),
                        });
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