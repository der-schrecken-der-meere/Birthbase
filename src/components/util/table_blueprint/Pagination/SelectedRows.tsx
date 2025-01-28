import { replace } from "@/lib/functions/string/replace";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";


type SelectedRowsProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>,
};

const SelectedRows = <TData,>({
    className,
    table,
    ...props
}: SelectedRowsProps<TData>) => {
    return (
        <div
            className={cn("flex-1 text-sm text-muted-foreground", className)}
            {...props}
        >
            {replace(
                "$1 von $2 Zeile(n) ausgewählt",
                table.getFilteredSelectedRowModel().rows.length,
                table.getFilteredRowModel().rows.length
            )}
        </div>
    )
}

export default SelectedRows;
