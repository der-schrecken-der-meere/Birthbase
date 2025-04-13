import { lazy, Suspense } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { BirthdayFormMode, useBirthdayFormStore } from "@/stores/use_birthday_form_store";
import { useTranslation } from "react-i18next";

const BirthdayForm = lazy(() => import("../forms/BirthdayForm").then((module) => module).catch(() => ({ default: () => <></> })));

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
                <div className="max-h-screen h-full overflow-auto scrollbar-visible">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { BirthdayFormDialog };