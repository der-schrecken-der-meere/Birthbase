import { Suspense, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import BirthdayForm from "../forms/BirthdayForm";
import { useBirthdayForm } from "@/hooks/useBirthdayForm";

const BirthdayFormDialog = () => {

    const { open, setOpen, operation } = useBirthdayForm();

    const DialogTitleString = useMemo(() => {
        return operation === "create"
            ? "Geburtstag erstellen"
            : "Geburtstag ändern oder löschen";
    }, [operation]);

    const DialogDescriptionString = useMemo(() => {
        return operation === "create"
            ? "Erstellen Sie einen neuen Geburtstag." + 
                " Dieser wird nach dem erfolgreichen Erstellen auf der Startseite " +
                " oder unter \"Meine Geburtstage\" angezeigt."
            : "Bearbeiten oder Löschen Sie den ausgewählten Geburtstag." +
                " Die neuen Daten werden nach dem erfolgreichen Aktualisieren oder Löschen auf der Startseite " +
                " oder unter \"Meine Geburtstage\" angezeigt.";
    }, [operation]) 

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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