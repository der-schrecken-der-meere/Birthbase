// Date FNS
import { setYear } from 'date-fns';

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
import { Column, ColumnDef } from '@tanstack/react-table';

// Tableblueprints
import { ColumnType, DataTableColumnHeader } from '../../util/table_blueprint/DataTableColumnHeader';

// Database
import { Birthday } from '@/database/tables/birthday/birthdays';

// Lib
import { calcAge, calc_days_until_next_birthday } from '@/lib/functions/birthdays/calculations';
import { current_date_to_iso } from '@/lib/functions/date/timezone';
import { open_birthday_form_update } from '@/hooks/use_birthday_form';
import { use_birthday_mutation } from '@/hooks/use_birthday_mutation';
import { useTranslation } from 'react-i18next';
import { format_day_month } from '@/lib/intl/date';

const ColumnHeader = <T,>({
    t_key,
    column,
    colType
}: {
    t_key: string
    column: Column<T, unknown>,
    colType: ColumnType
}) => {
    const { t } = useTranslation(["pages"]);

    return (
        <DataTableColumnHeader colType={colType} column={column} title={t(`my_birthdays.${t_key}`)}/>
    );
};

const getMeta = (key: string) => {
    return {
        ns: "pages",
        key: `my_birthdays.${key}`,
    };
};

export const columns: ColumnDef<Birthday>[] = [
    {
        id: "date",
        size: 9.375,
        accessorFn: (data) => {
            return setYear(new Date(data.date), new Date().getFullYear());
        },
        sortingFn: "datetime",
        header: ({ column }) => <ColumnHeader colType="date" column={column} t_key="date" />,
        cell: ({ cell }) => {
            const { i18n } = useTranslation();
            return <div className='font-medium'>{format_day_month(i18n.language, cell.getValue() as Date)}</div>
        },
        enableHiding: false,
    },
    {
        id: "lastname",
        size: 9.375,
        accessorKey: "name.last",
        sortingFn: "alphanumeric",
        filterFn: "includesString",
        enableColumnFilter: true,
        header: ({ column }) => <ColumnHeader colType="string" column={column} t_key="lastname" />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        },
        enableHiding: false,
    },
    {
        id: "firstname",
        size: 9.375,
        accessorKey: "name.first",
        sortingFn: "alphanumeric",
        meta: getMeta("firstname"),
        header: ({ column }) => <ColumnHeader colType="string" column={column} t_key="firstname" />,
        cell: ({ cell }) => {
            return <div className="capitalize">{cell.getValue() as string}</div>
        }
    },
    {
        id: "age",
        size: 9.375,
        accessorFn: (data) => {
            return calcAge(data.date, current_date_to_iso());
        },
        sortingFn: "alphanumeric",
        meta: getMeta("age"),
        header: ({ column }) => <ColumnHeader colType="number" column={column} t_key="age" />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "until",
        size: 9.375,
        meta: getMeta("until"),
        accessorFn: (data) => {
            return calc_days_until_next_birthday(data.date, current_date_to_iso());
        },
        sortingFn: "alphanumeric",
        header: ({ column }) => <ColumnHeader colType="number" column={column} t_key="until" />,
        cell: ({ cell }) => {
            return <div className='text-right font-medium'>{cell.getValue() as number}</div>
        }
    },
    {
        id: "other",
        size: 9.375,
        accessorFn: (data) => {
            return data;
        },
        header: () => {
            const { t } = useTranslation("pages");
            return t("my_birthdays.other");
        },
        cell: ({ cell, row }) => {

            const { t, i18n } = useTranslation("pages");

            const obj = cell.getValue() as Birthday;
            const age = row.getValue("age") as number + 1;
            const text = t("my_birthdays.copy_message", {
                count: row.getValue("until"),
                firstname: obj.name.first,
                lastname: obj.name.last,
                date: new Date(obj.date).toLocaleDateString(i18n.language),
                until: row.getValue("until"),
                age
            });
            
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
    const { delete_birthday } = use_birthday_mutation({});
    const { t } = useTranslation(["pages", "generally"]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Ellipsis className='h-4 w-4'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                <DropdownMenuLabel>
                    {t("my_birthdays.actions")}
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(clipboardText)}
                >
                    {t("my_birthdays.copy_as_message")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2" onClick={() => {
                    open_birthday_form_update(cell);
                    // dispatch(openUpdate(obj));
                }}>
                    {t("change_btn", { ns: "generally" })}
                    <Pencil className='h-4 w-4'/>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 text-destructive" onClick={() => {
                    delete_birthday(cell);
                }}>
                    {t("delete_btn", { ns: "generally" })}
                    <Trash2 className='h-4 w-4'/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default columns