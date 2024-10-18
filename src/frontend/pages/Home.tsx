import { useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { db } from "@/database/database_exports";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useToastNotification } from '../contexts/toastContext';
import { Birthday } from '@/database/tables/birthday';
import { calcDaysUntilNextBirthday } from '@/lib/main_util';
import { Button } from '../components/ui/button';
import { EyeOff } from 'lucide-react';
import { nanoid } from '@reduxjs/toolkit';

const Home = () => {
    return (
        <PageWrapper
            title='Startseite'
            docTitle='Birthbase - Startseite'
        >
            <BirthdayList/>
        </PageWrapper>
    );
};
export default Home;

const BirthdayList = () => {

    const [birthdays, setBirthdays] = useState<Birthday[]>(
        []
        // Array.from({length: 10}, () => ({
        //     id: nanoid(6) as any,
        //     name: {
        //         first: "haafhjhdhk",
        //         last: "aah"
        //     },
        //     date: "2024-10-17T19:10:51.433Z",
        //     marked: false,
        // }))
    );
    const { setErrorNotification } = useToastNotification();
    const remember = useSelector((state: RootState) => state.remember.remember);

    useEffect(() => {
        (async () => {
            try {
                const _birthdays = await db.getSortedBirthdays(remember, 10);
                setBirthdays(_birthdays);
            } catch (e) {
                setErrorNotification({
                    title: "Ist ein Fehler aufgetreten",
                    description: (
                        <>
                            <span>Beim Anzeigen der Geburtstage ist ein Fehler aufgetreten.</span>
                            <span>Fehler: {e as string}</span>
                        </>
                    )
                })
            }
        })();
    }, []);

    const onHideClick = (index: number) => {
        (async () => {
            const _birthdays = [...birthdays];
            const birthday = _birthdays.splice(index, 1)[0];
            try {
                await db.update("birthdays", {...birthday, ...{marked: true}});
                setBirthdays(_birthdays);
            } catch (e) {
                setErrorNotification({
                    title: "Fehler",
                    description: (
                        <>
                            Der Geburtstag konnte nicht als "Gelesen markiert werden"
                            <span>Fehler: {e as any}</span>
                        </>
                    )
                })
            }
        })();
    }

    return (
        <div className='px-4'>
            {birthdays.map((birthday, i) => (
                <div
                    key={birthday.id}
                    className="w-full rounded-md py-2 mb-2 flex items-center"
                >
                    {birthday.name.first}, {birthday.name.last}, {calcDaysUntilNextBirthday(new Date(birthday.date), new Date())}
                    <Button variant="ghost" className='ml-auto' size="icon" onClick={() => onHideClick(i)}>
                        <EyeOff className='h-4 w-4' />
                    </Button>
                </div>
            ))}
        </div>
    )
}