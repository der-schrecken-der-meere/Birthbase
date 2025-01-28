import { Table } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { MobileTableOptionsForm } from "@/components/forms/MobileTableOptions";

type MobileTableOptionsProps<TData> = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    table: Table<TData>
}

const MobileTableOptions = <TData,>({
    className,
    table,
    ...props
}: MobileTableOptionsProps<TData>) => {

    const [open, setOpen] = useState(false);

    const onSubmitClick = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("ml-auto h-full", className)}
                    {...props}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ansicht</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Tabellenoptionen</DialogTitle>
                <DialogDescription>Hier können Sie die Ansicht oder Parameter der Tabelle ändern</DialogDescription>
                <MobileTableOptionsForm
                    table={table}
                    onSubmitClick={onSubmitClick}
                />
            </DialogContent>
        </Dialog>
    )
}

export default MobileTableOptions;