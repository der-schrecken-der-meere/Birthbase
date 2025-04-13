import {
    ArrowDownZA,
    ArrowDown10,
    ArrowDownWideNarrow,
    ChevronsUpDown,
    EyeOff,
    ArrowUpNarrowWide,
    ArrowDown01,
    ArrowDownAZ,
    LucideProps,
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
import React, { createElement, FunctionComponent } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";


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
    let El = ArrowDownWideNarrow
    if      (type === "number")     El = ArrowDown10;
    else if (type === "string")     El = ArrowDownZA;
    else if (type === "date")       El = ArrowDown10;
    return (
        <El className={className} />
    );
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

    const headerEntries = [
        {
            id: "asc",
            text: t("ascending"),
            onClick: () => {
                column.toggleSorting(false);
                setSearchParams({"col": column.id, "sort": "asc"});
                new URL(".", window.origin + location.pathname + location.search);
            },
            icon: HeaderUpSymbol,
            colType
        },
        {
            id: "desc",
            text: t("descending"),
            onClick: () => {
                column.toggleSorting(true);
                setSearchParams({"col": column.id, "sort": "desc"});
                new URL(".", window.origin + location.pathname + location.search);
            },
            icon: HeaderDownSymbol,
            colType
        },
        {
            id: "reset",
            text: t("reset"),
            onClick: () => {
                column.clearSorting();
                setSearchParams({"col": column.id});
                new URL(".", window.origin + location.pathname + location.search);
            },
            icon: ChevronsUpDown,
        }
    ];

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 data-[state=open]:bg-accent gap-2"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <HeaderDownSymbol type={colType} className="h-4 w-4" />
                        ) : column.getIsSorted() === "asc" ? (
                            <HeaderUpSymbol type={colType} className="h-4 w-4" />
                        ) : (
                            <ChevronsUpDown className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {headerEntries.map((entry) => (
                        <HeaderEntry
                            key={entry.id}
                            onClick={entry.onClick}
                            Icon={entry.icon}
                            colType={entry.colType}
                        >
                            {entry.text}
                        </HeaderEntry>
                    ))}
                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <HeaderEntry
                                onClick={() => column.toggleVisibility(false)}
                                Icon={EyeOff}
                            >
                                {t("hide")}
                            </HeaderEntry>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

const HeaderEntry = ({
    children,
    className,
    Icon,
    colType,
    ...props
}: DropdownMenuItemProps & {
    Icon: FunctionComponent<HeaderSymbol & LucideProps>,
    colType?: ColumnType
}) => {
    return (
        <DropdownMenuItem
            className={cn("gap-2", className)}
            {...props}
        >
            {colType
                ? <Icon type={colType} className="h-3.5 w-3.5 text-muted-foreground/70" />
                : <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
            }
            {children}
        </DropdownMenuItem>
    )
};

export {
    DataTableColumnHeader
};