import { Table } from '@tanstack/react-table'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import DataTableViewOptions from './Filter/DataTableViewOptions'
import RowsPerPage from './Pagination/RowsPerPage'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

type MobileTableOptionsProps<TData> = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    table: Table<TData>
}

const MobileTableOptions = <TData,>({
    className,
    table,
    ...props
}: MobileTableOptionsProps<TData>) => {
    return (
        <Dialog>
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
                <DialogDescription>Einstellung der Tabelle für Mobilgeräte</DialogDescription>
                <ScrollArea className='max-h-[300px]'>
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => (
                            <div className="flex py-2 items-center" key={column.id}>
                                <Checkbox
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    id={`m-c-${column.id}`}
                                />
                                <Label htmlFor={`m-c-${column.id}`} className='ml-2'>
                                    {column.id}
                                </Label>
                            </div>
                        ))
                    }
                </ScrollArea>
                <Separator/>
                <RowsPerPage
                    rowsPerPage={[5, 10, 20, 30, 40, 50]}
                    table={table}
                />
            </DialogContent>
        </Dialog>
    )
}

export default MobileTableOptions;