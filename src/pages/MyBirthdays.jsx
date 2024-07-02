import React, { useRef, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { Button } from '@/components/ui/button'
import { MdAdd } from "react-icons/md";
import { Label } from '@/components/ui/label';
import Birthdays from "../birthdays/Birthdays.jsx";
import BirthdayForm from "../components/forms/BirthdayForm";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MyBirthdays = () => {
    const [open, setOpen] = useState(false);
    const dialogContainerRef = useRef(null);

    return (
        <PageWrapper className="overflow-auto max-h-full relative" title='Meine Geburtstage'>
            <Label className="flex items-center gap-4 text-base font-light">Geburtstag erstellen
                <Button size="icon" onClick={() => setOpen(!open)}>
                    <MdAdd color="hsl(var(--background))" size={24}/>
                </Button> 
            </Label>
            {/* <Birthdays/> */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent ref={dialogContainerRef} className="max-h-screen overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Geburtstag bearbeiten</DialogTitle>
                        <DialogDescription>
                            Erstellen oder Ändern von Daten eines Geburtstags.
                        </DialogDescription>
                    </DialogHeader>

                    <BirthdayForm customContainer={dialogContainerRef}/>

                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
        </PageWrapper>
    )
}

export default MyBirthdays