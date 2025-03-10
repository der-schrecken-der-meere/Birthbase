import { Suspense, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import BirthdayForm from "../forms/BirthdayForm";
import { BirthdayFormMode, use_birthday_form } from "@/hooks/use_birthday_form";
import { useTranslation } from "react-i18next";

const BirthdayFormDialog = () => {

    const open = use_birthday_form((state) => state.open);
    const operation = use_birthday_form((state) => state.operation);
    const set_open = use_birthday_form((state) => state.set_open);

    const { t } = useTranslation(["dialog"]);

    const DialogTitleString = useMemo(() => {
        return operation === BirthdayFormMode.CREATE
            ? t("birthday_form.create_title")
            : t("birthday_form.change_title");
    }, [operation]);

    const DialogDescriptionString = useMemo(() => {
        return operation === BirthdayFormMode.CREATE
            ? t("birthday_form.create_description")
            : t("birthday_form.change_description");
    }, [operation]) 

    return (
        <Dialog open={open} onOpenChange={set_open}>
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