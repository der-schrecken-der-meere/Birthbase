import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useCallback } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

const ConfirmDialog = () => {

    const { setOpen, open, config } = useConfirmDialog();

    const onCancelClick = useCallback(() => {
        setOpen(false);
        config.onCancel();
    }, [config]);
    const onActionClick = useCallback(() => {
        setOpen(false);
        config.onConfirm();
    }, [config]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{config.title}</AlertDialogTitle>
                    <AlertDialogDescription>{config.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelClick}>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={onActionClick}>Fortfahren</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { ConfirmDialog };