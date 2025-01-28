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
import { createElement, useMemo } from "react"

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
    const buttons = useMemo<NavigationButtons>(() => ([
        {
            id: "go-first",
            className: "",
            chevron: ChevronsLeft,
            disabled: table.getCanPreviousPage,
            onClick: () => table.setPageIndex(0),
            tooltip: "Zur ersten Seite navigieren",
        },
        {
            id: "go-prev",
            chevron: ChevronLeft,
            disabled: table.getCanPreviousPage,
            onClick: () => table.previousPage(),
            tooltip: "Zur vorherigen Seite navigieren",
        },
        {
            id: "go-next",
            chevron: ChevronRight,
            disabled: table.getCanNextPage,
            onClick: () => table.nextPage(),
            tooltip: "Zur nächsten Seite navigieren",
        },
        {
            id: "go-last",
            className: "",
            chevron: ChevronsRight,
            disabled: table.getCanNextPage,
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            tooltip: "Zur letzten Seite navigieren",
        },
    ]), []);

    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
            {buttons.map((e) => (
                <TooltipProvider key={e.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("h-8 w-8 p-0", e?.className)}
                                onClick={e.onClick}
                                disabled={!e.disabled()}
                            >
                                {createElement(e.chevron, { className: "h-4 w-4" })}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{e.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    )
}

export default Navigation