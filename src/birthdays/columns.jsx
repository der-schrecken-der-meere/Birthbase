import React from 'react'
import { setYear, format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { calcAge, calcDaysUntilNextBirthday } from '@/util';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMoreHoriz, MdOutlineEdit } from "react-icons/md";
import { RxCaretSort } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu"
/**
 * @typedef {{id: string, nameObj: {last: string, first: string}, birthday: string}} Birthday
 */

/**
 * 
 * @param {{column: import('@tanstack/react-table').Column}} param0 
 */
const SortHeader = ({
    column,
}) => {
    let sort = null;
            switch(column.getIsSorted()) {
                case "asc":
                    sort = <MdKeyboardArrowDown className='ml-2 w-4 h-4'/>
                    break;
                case "desc":
                    sort = <MdKeyboardArrowUp className='ml-2 w-4 h-4'/>
                    break;
                default:
                    sort = <RxCaretSort className='ml-2 w-4 h-4'/>
                    break
            }
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting()}
        >
            {column.columnDef?.meta?.display}
            {sort}
        </Button>
    );
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @type {import("@tanstack/react-table").ColumnDef<Birthday>[]}
 */
export const columns = [
    {
        id: "birthday",
        meta: {
            display: "Datum",
        }, 
        accessorFn: (data, index) => setYear(new Date(data.birthday), new Date().getFullYear()),
        sortingFn: "datetime",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("birthday"));
            return <div className='text-right font-medium'>{format(date, "dd.MM")}</div>
        },
    },
    {
        id: "lastname",
        meta: {
            display: "Nachname",
        },
        accessorKey: "nameObj.last",
        sortingFn: "alphanumeric",
        filterFn: "includesString",
        enableColumnFilter: true,
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue()}</div>
        }
    },
    {
        id: "firstname",
        meta: {
            display: "Vorname",
        },
        accessorKey: "nameObj.first",
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue()}</div>
        }
    },
    {
        id: "age",
        meta: {
            display: "Alter",
        },
        accessorFn: (data, index) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.birthday);
            return calcAge(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue()}</div>
        }
    },
    {
        id: "remaining",
        meta: {
            display: "Tage Bis",
        },
        accessorFn: (data, index) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.birthday);
            return calcDaysUntilNextBirthday(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue()}</div>
        }
    },
    {
        id: "actions",
        meta: {
            display: "Sonstiges",
        },
        accessorFn: (data, index) => {
            return data;
        },
        header: ({ column }) => (column.columnDef.meta.display),
        cell: ({ cell, row }) => {
            const obj = cell.getValue();
            const text = `${capitalize(obj.nameObj.first)} ${capitalize(obj.nameObj.last)} (${format(new Date(obj.birthday), "dd.MM.yyyy")}) wird in ${row.getValue("remaining")} Tagen ${row.getValue("age")} Jahr${row.getValue("age") === 1 ? "" : "e"} alt`;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MdMoreHoriz/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(text)}
                        >
                            Geburtstag als Nachricht kopieren
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-2">Ändern<MdOutlineEdit/></DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2 text-destructive">Löschen<LuTrash2/></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export default columns