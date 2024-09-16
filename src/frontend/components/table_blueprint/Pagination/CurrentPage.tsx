import { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { useMemo } from "react";
import { str_replace } from "@/lib/main_util";

type CurrentPageProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>;
    str: string
};

const CurrentPage = <TData,>({
    table,
    className,
    str,
    ...props
}: CurrentPageProps<TData>) => {

    const text = useMemo<string>(() => {
        const formated = str_replace(str, table.getState().pagination.pageIndex + 1, table.getPageCount());
        if (!formated) throw new Error("Arguments for certain placeholders are missing");
        return formated
    }, [str, table.getState().pagination.pageIndex, table.getPageCount()]);

    return (
        <div className={cn("flex w-[100px] items-center justify-center text-sm font-medium", className)} {...props}>
            {text}
        </div>
    )
};

export default CurrentPage;