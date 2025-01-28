import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ExtractPropertyOfArray } from "@/lib/types/array";

type ValueFilterProps<TData, TValue> = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"|"onChange"> & {
    table: Table<TData>,
    columnId: ExtractPropertyOfArray<ColumnDef<TData, TValue>[], "id">
}

export const ValueFilter = <TData, TValue>({
    className,
    table,
    columnId,
    placeholder,
    ...props
}: ValueFilterProps<TData, TValue>) => {
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        table.getColumn(columnId as string)?.setFilterValue(ev.target.value)
    };
    return (
        <Input
            value={(() => table.getColumn(columnId as string)?.getFilterValue() as (string|number) ?? "")()}
            className={cn("max-w-sm", className)}
            {...props}
            placeholder={placeholder}
            onChange={onChange}
        />
    );
};

export default ValueFilter;