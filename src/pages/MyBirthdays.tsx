import { lazy, Suspense } from 'react'

import Table from '@/components/tables/birthdays/Table';
import { Button } from '@/components/ui/button'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { MyBirthdaysSkeleton } from '@/components/skeletons/MyBirthdaysSkeleton';
import { Ellipsis } from 'lucide-react';

import { useNavbar } from '@/hooks/core/use_navbar';
import { useGetBirthdaysQuery } from '@/features/manage_birthdays/query';
import { useQuery } from '@/hooks/core/use_query';
import { useTableSortURL } from '@/hooks/use_table_sort_url';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';

import { delay_promise } from '@/lib/functions/promise/delay';
import { PageLinks } from '@/globals/constants/links';
import columns from "./../components/tables/birthdays/columns";

const OtherFunctionDialog = lazy(() => delay_promise(() => import("../components/dialogs/OtherFunctions"), 0));

const MyBirthdays = () => {
    
    const { t } = useTranslation(["navigation", "toast", "generally"]);
    const { defaultSorting } = useTableSortURL({ columns });
    const { data, isFetching } = useQuery({
        tKey: "birthdays",
        useQueryFn: useGetBirthdaysQuery,
    });
    
    useNavbar({
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


    if (isFetching) {
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