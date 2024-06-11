import React from 'react'
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
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
/**
 * @typedef {Object} Birthday
 * @property {string} id
 * @property {string} lastname
 * @property {string} firstname
 * @property {{year: number, month: number, day: number, str: string}} birthday
 */

/**
 * @type {import("@tanstack/react-table").ColumnDef<Birthday>[]}
 */
export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: "birthday",
        header: ({ column }) => {
            return (
                <Button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Datum
                    <MdKeyboardArrowDown className='ml-2 w-4 h-4'/>
                </Button>
                // <div className='text-right'>Datum</div>
            )
        },
        cell: ({ row }) => {
            const birthday = row.getValue("birthday");
            const date = new Date(birthday.year, birthday.month - 1, birthday.day);
            const formatted = date.toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            const month_day = formatted.slice(0, -5);
            return <div className='text-right font-medium'>{month_day}</div>
        },
    },
    {
        accessorKey: "nameObjLast",
        header: "Nachname",
        filterFn: "myCustomFilterFn",
        cell: ({ row }) => {
            return <div className="capitalize">{row.original.nameObj.last}</div>
        }
    },
    {
        accessorKey: "nameObj.first",
        header: "Vorname",
        cell: ({ row }) => {
            return <div className="capitalize">{row.original.nameObj.first}</div>
        }
    },
    {
        header: "Alter",
        cell: ({ row }) => {
            const birthdayObj = row.getValue("birthday");
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(birthdayObj.year, birthdayObj.month - 1, birthdayObj.day);
            const age = calcAge(birthdayDate, currentDate);
            return <div className='text-right font-medium'>{age}</div>
        }
    },
    {
        accessorKey: "daysUntil",
        header: () => <div className="text-nowrap">Tage bis</div>,
        cell: ({ row }) => {
            const birthdayObj = row.original.birthday;
            const currentDate = new Date(Date.now());
            const birthdayDate = new Date(birthdayObj.year, birthdayObj.month - 1, birthdayObj.day);
            const days = calcDaysUntilNextBirthday(birthdayDate, currentDate);
            return <div className='text-right font-medium'>{days}</div>
        }
    },
    {
        id: "test",
        accessorKey: "test",
        header: "Test",
        cell: ({ row }) => {
            const birthday = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <span>Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(birthday.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export default columns