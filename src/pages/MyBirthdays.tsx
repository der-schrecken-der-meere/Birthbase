import { useRef, lazy, Suspense } from 'react'

// Shadcn Components
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Skeleton } from "@/components/ui/skeleton";

// Custom Components
import PageWrapper from '@/components/PageWrapper'

// React Icons
import { MdAdd } from "react-icons/md";

// React Router
import { useOutletContext } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Store Slices
import { toggleOpen, changeDataInitial } from "../store/dataForm/dataFormSlice"
import Table from '@/birthdays/Table';
import { AppDispatch, RootState } from '@/store/store.js';

const BirthdayForm = lazy(() => import("../components/forms/BirthdayForm.jsx"))

const MyBirthdays = () => {
    return (
        <PageWrapper docTitle='Birthbase - Meine Geburtstage' className="overflow-visible max-h-full relative" title='Meine Geburtstage'>
            <Label className="inline-flex items-center gap-4 text-base font-light">Geburtstag erstellen
                <AddButton/>
            </Label>
            <Table/>
            <DialogWindow/>
            
        </PageWrapper>
    )
}

export default MyBirthdays

const AddButton = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Button
            aria-label="add-birthdays"
            size="icon"
            onClick={() => 
                dispatch(changeDataInitial({
                    open: true,
                }))
            }
        >
            <MdAdd color="hsl(var(--background))" size={24}/>
        </Button>    
    );
}

const DialogWindow = () => {
    const dispatch = useDispatch();
    const open = useSelector((state: RootState) => state.dataForm.open);
    const dialogContainerRef = useRef(null);
    const { mainRef } = useOutletContext<{ mainRef: React.MutableRefObject<null> }>();

    return (
        <Dialog
            open={open} onOpenChange={() => {
                dispatch(toggleOpen())
            }}
        >
            <DialogContent
                // className="p-0"
                container={mainRef?.current} 
                ref={dialogContainerRef}
            >
                {/* <ScrollArea 
                className="p-6"
                > */}
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
                {/* </ScrollArea> */}
            </DialogContent>
        </Dialog>
    );
}