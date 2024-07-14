import React, { useState } from 'react'

// Date FNS
import { setYear, format } from 'date-fns';

// Shadcn UI
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog";


import { calcAge, calcDaysUntilNextBirthday } from '../util';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMoreHoriz, MdOutlineEdit } from "react-icons/md";
import { RxCaretSort } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu"
import { db } from "../database/db";



// React Redux
import { useDispatch } from 'react-redux';

// Store Slices
import { changeDataState, toggleOpen, changeData, changeMethod } from "../store/dataForm/dataFormSlice"
import { deleteData } from "../store/data/dataSlice"

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
 * @type {import("@tanstack/react-table").ColumnDef<import('@/database/db').T_Birthday>[]}
 */
export const columns = [
    {
        id: "birthday",
        meta: {
            display: "Datum",
        }, 
        accessorFn: (data, index) => {
            return setYear(new Date(data.date), new Date().getFullYear());
        },
        sortingFn: "datetime",
        header: ({ column }) => <SortHeader column={column} />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{format(cell.getValue(), "dd.MM")}</div>
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
            return <div className="capitalize">{cell.getValue()}</div>
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
            const birthdayDate = new Date(data.date);
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
            const birthdayDate = new Date(data.date);
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
            const age = row.getValue("age") + 1;
            const text = `${capitalize(obj.name.first)} ${capitalize(obj.name.last)} (${format(new Date(obj.date), "dd.MM.yyyy")}) wird in ${row.getValue("remaining")} Tagen ${age} Jahr${age === 1 ? "" : "e"} alt`;
            
            return (
                <AktionDropdown
                    navigatorText={text}
                    cell={obj}
                />
            );
        }
    }
];

const AktionDropdown = ({
    navigatorText,
    cell,
}) => {
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
                onClick={() => navigator.clipboard.writeText(navigatorText)}
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
                    db.DELETE(cell.id);
                    dispatch(deleteData(cell.id));
                } catch (e) {
                    console.error(e);
                }
            }}>Löschen<LuTrash2/></DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default columns