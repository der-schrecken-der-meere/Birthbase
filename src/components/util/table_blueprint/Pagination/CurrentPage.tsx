import { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next";

type CurrentPageProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>;
};

const CurrentPage = <TData,>({
    table,
    className,
    ...props
}: CurrentPageProps<TData>) => {

    const { t } = useTranslation(["table"]);
    const current = table.getState().pagination.pageIndex + 1;
    const max = table.getPageCount();

    return (
        <div className={cn("flex items-center justify-center text-sm font-medium", className)} {...props}>
            {t("current_page", { current, max: max === 0 ? max + 1 : max })}
        </div>
    );
};

export default CurrentPage;