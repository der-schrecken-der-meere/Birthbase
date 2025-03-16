import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";


type SelectedRowsProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>,
};

const SelectedRows = <TData,>({
    className,
    table,
    ...props
}: SelectedRowsProps<TData>) => {

    const { t } = useTranslation("table");

    const selected = table.getFilteredSelectedRowModel().rows.length;
    const max = table.getFilteredRowModel().rows.length;

    return (
        <div
            className={cn("flex-1 text-sm text-muted-foreground", className)}
            {...props}
        >
            {t("rows_selected", { max, selected, count: max })}
        </div>
    );
};

export default SelectedRows;
