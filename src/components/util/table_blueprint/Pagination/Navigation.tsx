import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    LucideProps,
} from "lucide-react"
import { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { useTranslation } from "react-i18next"

type LucideElement = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

type NavigationProps<TData> = React.HTMLAttributes<HTMLDivElement> & {table: Table<TData>}

type NavigationButtons = {
    id: string,
    className?: string;
    onClick: () => void;
    disabled: () => boolean;
    tooltip: string;
    chevron: LucideElement
}[]

const Navigation = <TData,>({
    table,
    className,
    ...props
}: NavigationProps<TData>) => {
    const { t } = useTranslation(["table"]);

    const buttons: NavigationButtons = [
        {
            id: "go-first",
            className: "",
            chevron: ChevronsLeft,
            disabled: table.getCanPreviousPage,
            onClick: () => table.setPageIndex(0),
            tooltip: t("to_first"),
        },
        {
            id: "go-prev",
            chevron: ChevronLeft,
            disabled: table.getCanPreviousPage,
            onClick: () => table.previousPage(),
            tooltip: t("to_previous"),
        },
        {
            id: "go-next",
            chevron: ChevronRight,
            disabled: table.getCanNextPage,
            onClick: () => table.nextPage(),
            tooltip: t("to_next"),
        },
        {
            id: "go-last",
            className: "",
            chevron: ChevronsRight,
            disabled: table.getCanNextPage,
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            tooltip: t("to_last"),
        },
    ];

    return (
        <div className={cn("flex items-center [&_>_button:not(:last-of-type)]:mr-2 relative", className)} {...props}>
            <TooltipProvider>
                {buttons.map((e) => (
                    <Tooltip key={e.id}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("h-8 w-8 p-0", e?.className)}
                                onClick={e.onClick}
                                disabled={!e.disabled()}
                            >
                                <e.chevron className="h-4 w-4"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>{e.tooltip}</span>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    )
}

export default Navigation