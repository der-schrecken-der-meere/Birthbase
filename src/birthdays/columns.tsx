// Date FNS
import { setYear, format } from 'date-fns';

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { calcAge, calcDaysUntilNextBirthday } from '../util';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMoreHoriz, MdOutlineEdit } from "react-icons/md";
import { RxCaretSort } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu"
import { db } from "../database/birthbase";



// React Redux
import { useDispatch } from 'react-redux';

// Store Slices
import { changeDataState } from "../store/dataForm/dataFormSlice"
import { deleteData } from "../store/data/dataSlice"
import { Column, ColumnDef } from '@tanstack/react-table';

import { I_Birthday } from "@/database/birthbase";

interface I_SortHeader<TData> {
    column: Column<TData>
}

const SortHeader = <TData,>({
    column
}: I_SortHeader<TData>) => {
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

function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const columns: ColumnDef<I_Birthday>[] = [
    {
        id: "birthday",
        meta: {
            display: "Datum",
        }, 
        accessorFn: (data) => {
            return setYear(new Date(data.date), new Date().getFullYear());
        },
        sortingFn: "datetime",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{format(cell.getValue() as Date, "dd.MM")}</div>
        },
    },
    {
        id: "lastname",
        meta: {
            display: "Nachname",
        },
        accessorKey: "name.last",
        sortingFn: "alphanumeric",
        filterFn: "includesString",
        enableColumnFilter: true,
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        }
    },
    {
        id: "firstname",
        meta: {
            display: "Vorname",
        },
        accessorKey: "name.first",
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        }
    },
    {
        id: "age",
        meta: {
            display: "Alter",
        },
        accessorFn: (data) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.date);
            return calcAge(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "remaining",
        meta: {
            display: "Tage Bis",
        },
        accessorFn: (data) => {
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(data.date);
            return calcDaysUntilNextBirthday(birthdayDate, currentDate);
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "actions",
        meta: {
            display: "Sonstiges",
        },
        accessorFn: (data) => {
            return data;
        },
        header: ({ column }) => (column.columnDef?.meta?.display),
        cell: ({ cell, row }) => {

            const obj = cell.getValue() as I_Birthday;
            const age = row.getValue("age") as number + 1;
            const text = `${capitalize(obj.name.first)} ${capitalize(obj.name.last)} (${format(new Date(obj.date), "dd.MM.yyyy")}) wird in ${row.getValue("remaining")} Tagen ${age} Jahr${age === 1 ? "" : "e"} alt`;
            
            return (
                <AktionDropdown
                    clipboardText={text}
                    cell={obj}
                />
            );
        }
    }
];

interface I_ActionDropdown {
    clipboardText: string;
    cell: I_Birthday;
}

const AktionDropdown = ({
    clipboardText,
    cell,
}: I_ActionDropdown) => {
    const dispatch = useDispatch();

    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost">
                <MdMoreHoriz/>
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
                const obj = {
                    id: cell.id,
                    name: cell.name,
                    date: cell.date
                }
                dispatch(changeDataState({
                    method: "update",
                    value: obj,
                    open: true,
                }));
                // dispatch(changeDataMethod({
                //     method: "update",
                //     value: v,
                // }))
                // dispatch(toggleOpen());
            }}>Ändern<MdOutlineEdit/></DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 text-destructive" onClick={async () => {
                try {
                    db.tables.birthdays.delete(cell?.id as number);
                    dispatch(deleteData(cell?.id as number));
                } catch (e) {
                    console.error(e);
                }
            }}>Löschen<LuTrash2/></DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default columns