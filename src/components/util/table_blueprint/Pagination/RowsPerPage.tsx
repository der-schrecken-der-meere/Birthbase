import type { RowData, Table } from "@tanstack/react-table"
import type { SelectProps } from "@radix-ui/react-select"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type RowsPerPageProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>,
    rowsPerPage: number[],
};

const RowsPerPage = <TData,>({
    table,
    rowsPerPage,
    className,
    ...props
}: RowsPerPageProps<TData>) => {
    const { t } = useTranslation(["table"]);

    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
            <p className="text-sm font-medium">{t("rows_per_page")}</p>
            <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                    table.setPageSize(Number(value))
                }}
            >
                <SelectTrigger className="h-8 w-[4.375rem]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                    {rowsPerPage.map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

const RowsPerPageSelect = <TData extends RowData>({
    table,
    rowsPerPage,
    ...props
}: SelectProps & {
    table: Table<TData>,
    rowsPerPage: number[],
}) => {
    return (
        <Select
            {...props}
        >
            <SelectTrigger className="h-8 w-[4.375rem]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
                {rowsPerPage.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export { RowsPerPageSelect };
export default RowsPerPage;