import { lazy, Suspense, useEffect } from 'react'

// Shadcn Components
import { Button } from '@/components/ui/button'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

// Luicide
import { Ellipsis } from 'lucide-react';

// Custom Components

// React Icons

// React Router
import { useOutletContext } from 'react-router-dom';

// React Redux

// Store Slices

import Table from '@/components/tables/birthdays/Table.js';
import { delay_promise } from '@/lib/functions/promise/delay';
import { PageLinks } from '@/globals/constants/links';
import { update_navbar } from '@/hooks/use_app_navbar';
import { useTranslation } from 'react-i18next';
import { useTableSortURL } from '@/hooks/use-tableSortURL';
import columns from "./../components/tables/birthdays/columns";
import { get_birthdays_query } from '@/features/manage_birthdays/query';
import { MyBirthdaysSkeleton } from '@/components/skeletons/MyBirthdaysSkeleton';
import { create_toast, ToastType } from '@/hooks/use_app_toast';

const OtherFunctionDialog = lazy(() => delay_promise(() => import("../components/dialogs/OtherFunctions"), 0));

const MyBirthdays = () => {

    const { t } = useTranslation(["navigation", "toast", "generally"]);

    const { defaultSorting } = useTableSortURL({ columns });

    const { isLoading, isError, data, error, isFetching } = get_birthdays_query();

    update_navbar({
        docTitle: "main.my_birthdays",
        pageTitle: "main.my_birthdays",
        breadcrumbDisplay: [
            {
                id: "menu",
                type: [
                    {
                        display: t("main.home"),
                        href: PageLinks.HOME,
                    }
                ]
            }
        ],
    });

    useEffect(() => {
        if (isError) {
            console.error(error);
            create_toast({
                "title": t("error", { ns: "generally" }),
                "description": t("errors.show_birthdays", { ns: "toast" }),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    if (isLoading || isFetching) {
        return (
            <MyBirthdaysSkeleton/>
        );
    }
    
    return (
        <>
            {/* <OtherFunctions/> */}
            <Table
                defaultSorting={defaultSorting}
                data={data}
                columns={columns}
                className='shrink'
            />
        </>
    )
}

const OtherFunctions = () => {
    const { mainRef } = useOutletContext<{ mainRef: React.MutableRefObject<null> }>();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='h-8 ml-auto px-2' size={"sm"}>
                    <Ellipsis className='h-4 w-4'/>
                    <span className="hidden @sm:inline ml-2">Weitere Funktionen</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                container={mainRef.current}
            >
                <DialogHeader>
                    <DialogTitle>Weitere Funktionen</DialogTitle>
                    <DialogDescription className='sr-only'>Geburtstage aus Datei importieren oder Geburtstage als Datei exportieren</DialogDescription>
                </DialogHeader>
                <Suspense fallback={<p>Rendering</p>}>
                    <OtherFunctionDialog/>
                </Suspense>
            </DialogContent>
        </Dialog>
    );
}

export default MyBirthdays