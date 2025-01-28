import { Birthday } from "@/database/tables/birthday/birthdays";
import { Button } from "../../ui/button";
import { calcAge, calc_days_until_next_birthday } from "@/lib/functions/birthdays/calculations";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    EyeOff,
    PartyPopper,
} from "lucide-react";
import { current_date_to_iso } from "@/lib/functions/date/timezone";

export const getColumns = (removeElement: (id: number|string) => void): ColumnDef<Birthday>[] => [
    {
        id: "Datenanzeige",
        cell: ({ row }) => {

            const days = row.getValue("Tage bis") as number;

            const daysDisplay = (() => {
                if (days === 0) {
                    return <div><PartyPopper /></div>
                }
                if (days === 1) {
                    return <div>Morgen</div>
                }
                return (
                    <>
                        <div className="font-medium">{days}</div>
                        <div className="text-sm">Tage</div>
                    </>
                );
            })();

            return (
                <div className="flex gap-2 p-4 text-base items-center">
                    <div className="flex flex-col gap-1 items-start mr-2">
                        <div className="font-medium text-lg text-wrap">
                            {row.getValue("Name")}
                        </div>
                        <div className="flex flex-nowrap items-center gap-1 mt-auto text-sm">
                            wird {row.getValue("Wird")} am {format(new Date(row.original.date), "dd.MM")}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center rounded-lg bg-primary text-primary-foreground ml-auto w-14 min-w-min h-14 shrink-0 px-2">
                        {daysDisplay}
                    </div>
                </div>
            )
        }
    },
    {
        id: "Tage bis",
        accessorFn: (data) => {
            return calc_days_until_next_birthday(data.date, current_date_to_iso());
        },
        cell: ({ cell }) => <div className="text-nowrap">{cell.getValue() as string}</div>,
        header: ({ column }) => <div className="text-nowrap sr-only">{column.id}</div>,
    }, {
        id: "Name",
        accessorFn: (data) => {
            return `${data.name.first} ${data.name.last}`;
        },
        cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
        header: ({ column }) => <div className="text-nowrap sr-only">{column.id}</div>,
    }, {
        id: "Wird",
        accessorFn: (data) => {
            return calcAge(data.date, current_date_to_iso()) + 1;
        },
        cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
        header: ({ column }) => <div className="text-nowrap sr-only">{column.id}</div>,
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
        header: ({ column }) => <div className="text-nowrap sr-only">{column.id}</div>,
    }
];
