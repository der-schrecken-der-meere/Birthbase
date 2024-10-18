import { Birthday } from "@/database/tables/birthday";
import { Button } from "@/frontend/components/ui/button";
import { calcAge, calcDaysUntilNextBirthday } from "@/lib/main_util";
import { ColumnDef } from "@tanstack/react-table";
import { EyeOff } from "lucide-react";

export const getColumns = (removeElement: (id: number|string) => void): ColumnDef<Birthday>[] => [
    {
        id: "Tage bis",
        accessorFn: (data) => {
            return calcDaysUntilNextBirthday(new Date(data.date), new Date());
        },
        cell: ({ cell }) => <div className="text-nowrap">{cell.getValue() as string}</div>,
        header: ({ column }) => <div className="text-nowrap">{column.id}</div>,
    }, {
        id: "Name",
        accessorFn: (data) => {
            return `${data.name.first} ${data.name.last}`;
        },
        cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
    }, {
        id: "Wird",
        accessorFn: (data) => {
            return calcAge(new Date(data.date), new Date()) + 1;
        },
        cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
    }, {
        id: "Zukünftig nicht mehr anzeigen",
        accessorFn: (data) => {
            return data;
        },
        cell: ({ cell }) => {
            return (
                <Button
                    variant="ghost"
                    className='ml-auto'
                    size="icon"
                    onClick={() => removeElement((cell.getValue() as Birthday).id)}
                >
                    <EyeOff className='h-4 w-4' />
                </Button>
            )
        },
        header: ({ column }) => <div className="text-nowrap">{column.id}</div>,
    }
];
