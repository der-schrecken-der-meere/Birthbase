import React from 'react'
import PageWrapper from '../components/PageWrapper'
import { Button } from '@/components/ui/button'
import { MdAdd } from "react-icons/md";
import { Label } from '@/components/ui/label';
import Birthdays from "../birthdays/Birthdays.jsx";

const MyBirthdays = () => {
  return (
    <PageWrapper title='Meine Geburtstage'>
        <Label className="flex items-center gap-4 text-base font-light">Geburtstag erstellen
          <Button size="icon">
            <MdAdd color="hsl(var(--background))" size={24}/>
          </Button> 
        </Label>
        <Birthdays/>
    </PageWrapper>
  )
}

export default MyBirthdays