import React, { useRef, lazy, Suspense } from 'react'

// Shadcn Components
import { Label } from "../components/ui/label.jsx"
import { Button } from '../components/ui/button'
import { 
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../components/ui/dialog';
import { Skeleton } from "../components/ui/skeleton.jsx";

// Custom Components
import PageWrapper from '../components/PageWrapper'
import DataTable from '../birthdays/DataTable';

// React Icons
import { MdAdd } from "react-icons/md";

// React Router
import { useOutletContext } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Store Slices
import { toggleOpen, changeDataState, changeDataInitial } from "../store/dataForm/dataFormSlice"

const BirthdayForm = lazy(() => import("../components/forms/BirthdayForm.jsx"))

const MyBirthdays = () => {
    document.title = "Birthbase - Meine Geburtstage";

    return (
        <PageWrapper className="overflow-visible max-h-full relative" title='Meine Geburtstage'>
            <Label className="inline-flex items-center gap-4 text-base font-light">Geburtstag erstellen
                <AddButton/>
            </Label>
            <DataTable/>
            <DialogWindow/>
            
        </PageWrapper>
    )
}

export default MyBirthdays

const AddButton = () => {
    const dispatch = useDispatch();

    return (
        <Button aria-label="add-birthdays" size="icon" onClick={() => {
            dispatch(changeDataInitial({
                "open": true,
            }));
        }}>
            <MdAdd color="hsl(var(--background))" size={24}/>
        </Button>    
    );
}

const DialogWindow = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.dataForm.open);
    const dialogContainerRef = useRef(null);
    const { mainRef } = useOutletContext();

    return (
        <Dialog
            open={open} onOpenChange={() => {
                dispatch(toggleOpen())
            }}
        >
            <DialogContent 
                container={mainRef?.current} 
                ref={dialogContainerRef} className="overflow-auto"
            >
                <DialogHeader>
                    <DialogTitle>Geburtstag bearbeiten</DialogTitle>
                    <DialogDescription>
                        Erstellen oder Ändern von Daten eines Geburtstags.
                    </DialogDescription>
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
                    <BirthdayForm customContainer={dialogContainerRef}/>
                </Suspense>

                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}