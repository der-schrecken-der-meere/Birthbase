import { useEffect, useState } from 'react'
import { NavigationEntry } from '../Settings'
import { Progress } from "@/components/ui/progress"
import { Separator } from '@/components/ui/separator'
import { byte_format } from '@/lib/formats/storage'
import StorageSize from "@/components/tables/storagesize/StorageSize"
import { useNavbar } from '@/hooks/useNavbar'
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout'
// import { toSmallestByteType } from '@/lib/functions/storage/unit'

type StorageCapacity = {
    available: string;
    used: string;
    value: number;
}

const Storage = () => {
    const [value, setValue] = useState<StorageCapacity>({available: "0", used: "0", value: 0});

    useNavbar({
        pageTitle: "Speicher",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    useEffect(() => {
        // (async () => {
        //     try {
        //         const res = await navigator.storage.estimate();
        //         setValue(() => {
        //             const available = toSmallestByteType(res?.quota as number);
        //             const used = toSmallestByteType(res?.usage as number);

        //             return {
        //                 available: byte_format("de", available.u, available.v),
        //                 used: byte_format("de", used.u, used.v),
        //                 value: (res?.usage as number) / (res?.quota as number) * 100
        //             }
        //         });
        //     } catch (error) {
        //         console.error(error)
        //     }
        // })()
    }, [])

    return (
        <>
            <NavigationEntry>
                <div className='flex items-center mb-auto'>
                    <div>Belegter Speicher</div>
                    <div className='ml-auto text-sm text-muted-foreground'>
                        {value.used}/{value.available} belegt
                    </div>
                </div>
                <Progress value={value.value} className="w-full h-2 mt-2"/>
            </NavigationEntry>
            <Separator/>
            <NavigationEntry>
                <StorageSize/>
            </NavigationEntry>
        </>
    )
}
export default Storage