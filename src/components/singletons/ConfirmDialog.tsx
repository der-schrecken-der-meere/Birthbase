import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

import { useConfirmStore } from "@/stores/use_confirm_store";

import { useTranslation } from "react-i18next";

const ConfirmDialog = () => {

    const { t } = useTranslation(["generally"]);

    const setOpen = useConfirmStore((state) => state.setOpen);
    const { on_cancel, on_confirm, description, title } = useConfirmStore((state) => state.config);
    const isOpen = useConfirmStore((state) => state.isOpen);

    const on_cancel_click = () => {
        setOpen(false);
        on_cancel();
    };
    const on_action_click = () => {
        setOpen(false);
        on_confirm();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
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
    );
};

export { ConfirmDialog };