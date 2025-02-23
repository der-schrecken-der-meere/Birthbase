import { useCallback } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { use_app_confirm } from "@/hooks/use_app_confirm";
import { useTranslation } from "react-i18next";

const ConfirmDialog = () => {

    const open = use_app_confirm((state) => state.open);
    const set_open = use_app_confirm((state) => state.set_open);
    const { description, title, on_cancel, on_confirm } = use_app_confirm((state) => state.config);

    const { t } = useTranslation(["generally"]);

    const on_cancel_click = useCallback(() => {
        set_open(false);
        on_cancel();
    }, [on_cancel]);
    const on_action_click = useCallback(() => {
        set_open(false);
        on_confirm();
    }, [on_confirm]);

    return (
        <AlertDialog open={open} onOpenChange={set_open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={on_cancel_click}>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={on_action_click}>{t("continue")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { ConfirmDialog };