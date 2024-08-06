import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { NavigationEntry } from '../Settings'
import { Progress } from "../../../components/ui/progress"
import { Separator } from '@/components/ui/separator'
import { toSmallestByteType, Format } from '@/util'
import StorageSize from "@/storagesize/StorageSize"
import { Decimal } from 'decimal.js'

type StorageCapacity = {
    available: string;
    used: string;
    value: number;
}

const Storage = () => {
    const [value, setValue] = useState<StorageCapacity>({available: "0", used: "0", value: 0});

    useEffect(() => {
        (async () => {
            try {
                const res = await navigator.storage.estimate();
                setValue(() => {
                    const available = toSmallestByteType(new Decimal(res?.quota as number));
                    const used = toSmallestByteType(new Decimal(res?.usage as number));

                    return {
                        available: Format.Byte("de", available.u, available.v),
                        used: Format.Byte("de", used.u, used.v),
                        value: (res?.usage as number) / (res?.quota as number) * 100
                    }
                });
            } catch (error) {
                console.error(error)
            }
        })()
    }, [])

    return (
        <PageWrapper goBack={1} title='Speicher'>
            <NavigationEntry
                caption={<>&nbsp;</>}
            >
                <div className='flex items-center'>
                    <div>Belegter Speicher</div>
                    <span className='ml-auto text-sm text-muted-foreground'>{value.used}/{value.available} belegt</span>
                </div>
                <Progress value={value.value} className="w-full absolute bottom-0"/>
            </NavigationEntry>
            <Separator/>
            <NavigationEntry>
                <StorageSize/>
            </NavigationEntry>
        </PageWrapper>
    )
}
export default Storage