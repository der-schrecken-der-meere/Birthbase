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

const OtherFunctionDialog = lazy(() => delay_promise(() => import("../components/dialogs/OtherFunctions"), 0));

const MyBirthdays = () => {

    update_navbar({
        docTitle: "Birthbase - Meine Geburtstage",
        pageTitle: "Meine Geburtstage",
        breadcrumbDisplay: [
            {
                id: "menu",
                type: [
                    {
                        display: "Startseite",
                        href: PageLinks.HOME,
                    }
                ]
            }
        ],
    });

    return (
        <>
            {/* <OtherFunctions/> */}
            <Table className='shrink' />
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