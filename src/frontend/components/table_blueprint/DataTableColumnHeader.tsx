import {
    ArrowUpAZ,
    ArrowDownZA,
    ArrowDown10,
    ArrowDownWideNarrow,
    ChevronsUpDown,
    EyeOff,
    ArrowUp01,
    ArrowUpNarrowWide,
} from "lucide-react";
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/frontend/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu"
import React, { createElement } from "react";
import { useLocation, useSearchParams } from "react-router-dom";


type ColumnType = "string"|"number"|"date"|"mixed";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    colType: ColumnType
}

interface HeaderSymbol {
    type?: ColumnType
    className?: string
} 

const HeaderDownSymbol = ({
    type,
    className
}: HeaderSymbol) => {
    let el = ArrowDownWideNarrow
    if      (type === "number")     el = ArrowDown10;
    else if (type === "string")     el = ArrowDownZA;
    else if (type === "date")       el = ArrowDown10;
    return createElement(el, { className: className });
}

const HeaderUpSymbol = ({
    type,
    className
}: HeaderSymbol) => {
    let el = ArrowUpNarrowWide
    if (type === "number")  el = ArrowUp01;
    if (type === "string")  el = ArrowUpAZ;
    if (type === "date")    el = ArrowUp01;
    return createElement(el, { className: className });
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    colType = "mixed",
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const [_, setSearchParams] = useSearchParams();
    const location = useLocation();

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
                        Aufsteigend
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {column.toggleSorting(true);setSearchParams({"col": column.id, "sort": "asc"});new URL(".", window.origin + location.pathname + location.search)}}>
                        <HeaderDownSymbol type={colType} className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Absteigend
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {column.clearSorting();setSearchParams({"col": column.id});new URL(".", window.origin + location.pathname + location.search)}}>
                        <ChevronsUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Zurücksetzen
                    </DropdownMenuItem>
                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Ausblenden
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
