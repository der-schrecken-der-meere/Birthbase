import { Suspense } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import BirthdayForm from "../forms/BirthdayForm";
import { BirthdayFormMode, useBirthdayFormStore } from "@/stores/use_birthday_form_store";
import { useTranslation } from "react-i18next";

const BirthdayFormDialog = () => {

    const isOpen = useBirthdayFormStore((state) => state.isOpen);
    const formMode = useBirthdayFormStore((state) => state.formMode);
    const setOpen = useBirthdayFormStore((state) => state.setOpen);

    const { t } = useTranslation(["dialog"]);

    const DialogTitleString = formMode === BirthdayFormMode.CREATE
        ? t("birthday_form.create_title")
        : t("birthday_form.change_title");

    const DialogDescriptionString = formMode === BirthdayFormMode.CREATE
        ? t("birthday_form.create_description")
        : t("birthday_form.change_description");

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="p-0 overflow-hidden">
                <ScrollArea className="max-h-screen h-full">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle>{DialogTitleString}</DialogTitle>
                            <DialogDescription>{DialogDescriptionString}</DialogDescription>
                        </DialogHeader>

                        <Suspense fallback={
                            <div className='flex flex-col space-y-8'>
                                <div className='space-y-2'>
                                    <Skeleton className="w-[80px] h-6"/>
                                    <Skeleton className="w-full h-10"/>
                                    <Skeleton className="w-full h-5"/>
                                </div>
                                <div className='space-y-2'>
                                    <Skeleton className="w-[80px] h-6"/>
                                    <Skeleton className="w-full h-10"/>
                                    <Skeleton className="w-full h-5"/>
                                </div>
                                <div className='space-y-2'>
                                    <Skeleton className="w-[80px] h-6"/>
                                    <Skeleton className="w-full h-10"/>
                                    <Skeleton className="w-full h-5"/>
                                </div>
                                <Skeleton className="w-[120px] h-10"/>
                            </div>
                        }>
                            <BirthdayForm/>
                        </Suspense>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export { BirthdayFormDialog };