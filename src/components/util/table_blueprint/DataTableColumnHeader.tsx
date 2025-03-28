import {
    ArrowDownZA,
    ArrowDown10,
    ArrowDownWideNarrow,
    ChevronsUpDown,
    EyeOff,
    ArrowUpNarrowWide,
    ArrowDown01,
    ArrowDownAZ,
} from "lucide-react";
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { createElement } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


export type ColumnType = "string"|"number"|"date"|"mixed";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    colType: ColumnType
};

interface HeaderSymbol {
    type?: ColumnType
    className?: string
};

const HeaderDownSymbol = ({
    type,
    className
}: HeaderSymbol) => {
    let el = ArrowDownWideNarrow
    if      (type === "number")     el = ArrowDown10;
    else if (type === "string")     el = ArrowDownZA;
    else if (type === "date")       el = ArrowDown10;
    return createElement(el, { className: className });
};

const HeaderUpSymbol = ({
    type,
    className
}: HeaderSymbol) => {
    let el = ArrowUpNarrowWide
    if (type === "number")  el = ArrowDown01;
    if (type === "string")  el = ArrowDownAZ;
    if (type === "date")    el = ArrowDown01;
    return createElement(el, { className: className });
}

const DataTableColumnHeader = <TData, TValue>({
    column,
    title,
    className,
    colType = "mixed",
}: DataTableColumnHeaderProps<TData, TValue>) => {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const [_, setSearchParams] = useSearchParams();
    const location = useLocation();

    const { t } = useTranslation("table");

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <HeaderDownSymbol type={colType} className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "asc" ? (
                            <HeaderUpSymbol type={colType} className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => {column.toggleSorting(false);setSearchParams({"col": column.id, "sort": "asc"});new URL(".", window.origin + location.pathname + location.search)}}>
                        <HeaderUpSymbol type={colType} className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        {t("ascending")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {column.toggleSorting(true);setSearchParams({"col": column.id, "sort": "desc"});new URL(".", window.origin + location.pathname + location.search)}}>
                        <HeaderDownSymbol type={colType} className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        {t("descending")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {column.clearSorting();setSearchParams({"col": column.id});new URL(".", window.origin + location.pathname + location.search)}}>
                        <ChevronsUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        {t("reset")}
                    </DropdownMenuItem>
                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                {t("hide")}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export {
    DataTableColumnHeader
};