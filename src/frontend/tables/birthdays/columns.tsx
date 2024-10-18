// Date FNS
import { setYear, format } from 'date-fns';

// Shadcn UI
import { Button } from "@/frontend/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu"

// React Icons
import {
    Trash2,
    Ellipsis,
    Pencil,
} from "lucide-react"

// React Redux
import { useDispatch } from 'react-redux';

// Store Slices
import { openUpdate } from "../../store/dataForm/dataFormSlice"
import { deleteData } from "../../store/data/dataSlice"

// Tanstack table
import { ColumnDef } from '@tanstack/react-table';

// Tableblueprints
import { DataTableColumnHeader } from '@/frontend/components/table_blueprint/DataTableColumnHeader';

// Database
import { db } from "@/database/database_exports";
import { Birthday } from '@/database/tables/birthday';

// Lib
import { calcAge, calcDaysUntilNextBirthday, capitalize } from '@/lib/main_util';

export const columns: ColumnDef<Birthday>[] = [
    {
        id: "Datum",
        size: 9.375,
        accessorFn: (data) => {
            return setYear(new Date(data.date), new Date().getFullYear());
        },
        sortingFn: "datetime",
        header: ({ column }) => <DataTableColumnHeader colType="date" column={column} title={column.id}/>,
        cell: ({ cell }) => {
            return <div className='font-medium'>{format(cell.getValue() as Date, "dd.MM")}</div>
        },
        enableHiding: false,
    },
    {
        id: "Nachname",
        size: 9.375,
        accessorKey: "name.last",
        sortingFn: "alphanumeric",
        filterFn: "includesString",
        enableColumnFilter: true,
        header: ({ column }) => <DataTableColumnHeader colType="string" column={column} title={column.id}/>,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        },
        enableHiding: false,
    },
    {
        id: "Vorname",
        size: 9.375,
        accessorKey: "name.first",
        sortingFn: "alphanumeric",
        header: ({ column }) => <DataTableColumnHeader colType="string" column={column} title={column.id}/>,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        }
    },
    {
        id: "Alter",
        size: 9.375,
        accessorFn: (data) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.date);
            return calcAge(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <DataTableColumnHeader colType="number" column={column} title={column.id}/>,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "Tage bis",
        size: 9.375,
        accessorFn: (data) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.date);
            return calcDaysUntilNextBirthday(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <DataTableColumnHeader colType="number" column={column} title={column.id}/>,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "Sontiges",
        size: 9.375,
        accessorFn: (data) => {
            return data;
        },
        header: ({ column }) => (column.id),
        cell: ({ cell, row }) => {

            const obj = cell.getValue() as Birthday;
            const age = row.getValue("Alter") as number + 1;
            const text = `${capitalize(obj.name.first)} ${capitalize(obj.name.last)} (${format(new Date(obj.date), "dd.MM.yyyy")}) wird in ${row.getValue("Tage bis")} Tagen ${age} Jahr${age === 1 ? "" : "e"} alt`;
            
            return (
                <AktionDropdown
                    clipboardText={text}
                    cell={obj}
                />
            );
        },
        enableHiding: false,
    }
];

interface I_ActionDropdown {
    clipboardText: string;
    cell: Birthday;
}

const AktionDropdown = ({
    clipboardText,
    cell,
}: I_ActionDropdown) => {
    const dispatch = useDispatch();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Ellipsis className='h-4 w-4'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(clipboardText)}
                >
                    Geburtstag als Nachricht kopieren
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2" onClick={() => {
                    const obj: Birthday = {
                        id: cell.id,
                        name: cell.name,
                        date: cell.date,
                        marked: false,
                    }
                    dispatch(openUpdate(obj));
                }}>
                    Ändern
                    <Pencil className='h-4 w-4'/>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 text-destructive" onClick={async () => {
                    try {
                        const isDeleted = await db.Delete("birthdays", cell.id);
                        if (isDeleted > 0) {
                            dispatch(deleteData(cell.id));
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }}>
                    Löschen
                    <Trash2 className='h-4 w-4'/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default columns