import { useRef, lazy, Suspense } from 'react'

// Shadcn Components
import { Label } from "@/frontend/components/ui/label"
import { Button } from '@/frontend/components/ui/button'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/frontend/components/ui/dialog';
import { Skeleton } from "@/frontend/components/ui/skeleton";

// Custom Components
import PageWrapper from '@/frontend/components/PageWrapper'

// React Icons
import { MdAdd } from "react-icons/md";

// React Router
import { useOutletContext } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Store Slices
import { toggleOpen, changeDataInitial } from "@/frontend/store/dataForm/dataFormSlice.js"
import Table from '@/frontend/tables/birthdays/Table.js';
import { AppDispatch, RootState } from '@/frontend/store/store.js';

const BirthdayForm = lazy(() => import("@/frontend/components/forms/BirthdayForm"))

const MyBirthdays = () => {
    return (
        <PageWrapper docTitle='Birthbase - Meine Geburtstage' title='Meine Geburtstage'>
            <Label className="inline-flex w-max items-center gap-4 text-base font-light">
                Geburtstag erstellen
                <AddButton/>
            </Label>
            <Table className=''/>
            <DialogWindow/>
        </PageWrapper>
    )
}

export default MyBirthdays

const AddButton = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Button
            className='h-8 w-8'
            aria-label="add-birthdays"
            size="icon"
            onClick={() => 
                dispatch(changeDataInitial({
                    open: true,
                }))
            }
        >
            <MdAdd className='h-4 w-4'/>
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
                        <BirthdayForm/>
                    </Suspense>

                    <DialogFooter>
                    </DialogFooter>
                {/* </ScrollArea> */}
            </DialogContent>
        </Dialog>
    );
}