import { useCallback, useEffect, useState } from 'react';
import { db } from "@/database/database_exports";
import { useAppToast } from '../hooks/useAppToast';
import { Birthday } from '@/database/tables/birthday/birthdays';
import Table from '../components/tables/birthdaysSoon/Table';
import { nanoid } from '@reduxjs/toolkit';
import { get_birthdays_query } from '@/features/manage_birthdays/query';
import { Skeleton } from '../components/ui/skeleton';
import { useNavbar } from '../hooks/useNavbar';
import { AddBirthdayButton } from '../components/AddBirthdayButton';

const Home = () => {

    useNavbar({docTitle: "Birthbase - Startseite", "pageTitle": "Startseite", breadcrumbDisplay: []});

    return (
        <>
            <BirthdayList/>
        </>
    );
};
export default Home;

const BirthdayList = () => {

    // const [birthdays, setBirthdays] = useState<Birthday[]>(
    //     []
    //     // Array.from({length: 10}, (_, i) => ({
    //     //     id: nanoid(6) as any,
    //     //     name: {
    //     //         first: "Francessco",
    //     //         last: "De Luca"
    //     //     },
    //     //     date: `2024-${i > 3 ? "11" : "10"}-21T21:00:00.000Z`,
    //     //     marked: false,
    //     // }))
    // );
    // const remember = useSelector((state: RootState) => state.remember.value);
    const { setErrorNotification } = useAppToast();
    const { data, isError, error, isFetching } = get_birthdays_query();

    const removeElement = useCallback((id: number|string) => {
        (async () => {
            try {
                await db.update("birthdays", {id, marked: true} as any);
                setBirthdays((birthdays) => birthdays.filter((birthday) => birthday.id !== id));
            } catch (e) {
                setErrorNotification({
                    title: "Fehler",
                    description: (
                        <>
                            Der Geburtstag konnte nicht als "Gelesen" markiert werden
                            <br/>
                            <span>Fehler: {(e as any).msg.message as any}</span>
                        </>
                    )
                })
            }
        })();
    }, []);

    useEffect(() => {
        if (isError) {
            setErrorNotification({
                title: "Fehler beim Anzeigen der Geburtstage",
                description: JSON.stringify(error),
            })
        }
    }, [isError, error]);

    if (isFetching) {
        return (
            <>
                <Skeleton className='w-full h-36' />
            </>
        )
    }

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             console.log(remember);
    //             // const _birthdays = await db.getSortedBirthdays(remember, 10);
    //             const _birthdays = await getSortedBirthdays();
    //             setBirthdays(_birthdays);
    //             if (Notification.permission === "granted" && _birthdays.length > 0) {
    //                 const n = new Notification("Birthbase", {
    //                     "icon": "/icon.ico",
    //                     "body": `Es stehen ${birthdays.length} Geburstag/e kurz bevor`,
    //                 })
    //             }
    //         } catch (e) {
    //             setErrorNotification({
    //                 title: "Ist ein Fehler aufgetreten",
    //                 description: (
    //                     <>
    //                         <span>Beim Anzeigen der Geburtstage ist ein Fehler aufgetreten.</span>
    //                         <span>Fehler: {e as string}</span>
    //                     </>
    //                 )
    //             })
    //         }
    //     })();
    // }, []);

    return (
        <Table
            data={data as Birthday[]}
            removeElement={removeElement}
            className="flex-1"
        />
    )
}