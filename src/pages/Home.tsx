import { useEffect } from 'react';
import { Birthday } from '@/database/tables/birthday/birthdays';
import Table from '../components/tables/birthdaysSoon/Table';
import { get_birthdays_query } from '@/features/manage_birthdays/query';
import { Skeleton } from '../components/ui/skeleton';
import { create_toast, ToastType } from '@/hooks/use_app_toast';
import { update_navbar } from '@/hooks/use_app_navbar';

const Home = () => {

    update_navbar({
        docTitle: "Birthbase - Startseite",
        "pageTitle": "Startseite",
        breadcrumbDisplay: []
    });

    return (
        <>
            <BirthdayList/>
        </>
    );
};

const BirthdayList = () => {
    const { data, isError, error, isFetching } = get_birthdays_query();

    useEffect(() => {
        if (isError) {
            create_toast({
                title: "Fehler beim Anzeigen der Geburtstage",
                description: JSON.stringify(error),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    if (isFetching) {
        return (
            <>
                <Skeleton className='w-full h-36' />
            </>
        );
    }

    return (
        <Table
            data={data as Birthday[]}
            className="flex-1"
        />
    );
};

export default Home;