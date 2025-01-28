// Date FNS
import { setYear, format } from 'date-fns';

// Shadcn UI
import { Button } from "../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

// React Icons
import {
    Trash2,
    Ellipsis,
    Pencil,
} from "lucide-react"

// Store Slices

// Tanstack table
import { ColumnDef } from '@tanstack/react-table';

// Tableblueprints
import { DataTableColumnHeader } from '../../util/table_blueprint/DataTableColumnHeader';

// Database
import { Birthday } from '@/database/tables/birthday/birthdays';

// Lib
import { calcAge, calc_days_until_next_birthday } from '@/lib/functions/birthdays/calculations';
import { capitalize } from '@/lib/functions/string/format';
import { useDeleteBirthdays } from '@/hooks/useDeleteBirthday';
import { useBirthdayForm } from '@/hooks/useBirthdayForm';
import { current_date_to_iso } from '@/lib/functions/date/timezone';

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
            return calcAge(data.date, current_date_to_iso());
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
            return calc_days_until_next_birthday(data.date, current_date_to_iso());
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
    const { deleteBirthday } = useDeleteBirthdays({});
    const { openBirthdayFormUpdate } = useBirthdayForm();

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
                    openBirthdayFormUpdate(cell);
                    // dispatch(openUpdate(obj));
                }}>
                    Ändern
                    <Pencil className='h-4 w-4'/>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 text-destructive" onClick={() => {
                    deleteBirthday(cell);
                }}>
                    Löschen
                    <Trash2 className='h-4 w-4'/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default columns