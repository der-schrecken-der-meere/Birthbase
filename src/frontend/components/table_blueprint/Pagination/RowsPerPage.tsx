import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select"
import { Table } from "@tanstack/react-table"

type RowsPerPageProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>,
    rowsPerPage: number[],
}

const RowsPerPage = <TData,>({
    table,
    rowsPerPage,
    className,
    ...props
}: RowsPerPageProps<TData>) => {
    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
            <p className="text-sm font-medium">Zeilen pro Seite</p>
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
    )
}

export default RowsPerPage