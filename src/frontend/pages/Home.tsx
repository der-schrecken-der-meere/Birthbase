import { useCallback, useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { db } from "@/database/database_exports";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useToastNotification } from '../contexts/toastContext';
import { Birthday } from '@/database/tables/birthday';
import Table from '../tables/birthdaysSoon/Table';

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
    );
    const { setErrorNotification } = useToastNotification();
    const remember = useSelector((state: RootState) => state.remember.remember);

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
        (async () => {
            try {
                const _birthdays = await db.getSortedBirthdays(remember, 10);
                setBirthdays(_birthdays);
                if (Notification.permission === "granted" && _birthdays.length > 0) {
                    const n = new Notification("Hallo", {
                        "icon": "/icon.ico",
                        "body": `Es stehen ${birthdays.length} Geburstag/e kurz bevor`,
                    })
                }
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

    return (
        <Table
            data={birthdays}
            removeElement={removeElement}
        />
    )
}