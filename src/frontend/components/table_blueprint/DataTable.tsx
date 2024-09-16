import {
    type ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    RowSelectionState,
    SortingState,
    Table as T_Table,
    type TableOptions,
    useReactTable,
    VisibilityState,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table"
   
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/frontend/components/ui/table.jsx"
import React, { useMemo, type Dispatch, type SetStateAction } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    className?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filter?: [ColumnFiltersState, Dispatch<SetStateAction<ColumnFiltersState>>];
    selection?: [RowSelectionState, Dispatch<SetStateAction<RowSelectionState>>];
    sorting?: [SortingState, Dispatch<SetStateAction<SortingState>>];
    visibility?: [VisibilityState, Dispatch<SetStateAction<VisibilityState>>];
    pagination?: boolean;
    footerElements?: (table: T_Table<TData>) => React.ReactNode;
    headerElements?: (table: T_Table<TData>) => React.ReactNode;
    defaultSorting?: SortingState;
}
export const DataTable = <TData, TValue>({
    className,
    columns,
    data,
    filter,
    selection,
    sorting,
    visibility,
    pagination,
    footerElements,
    headerElements,
    defaultSorting,
}: DataTableProps<TData, TValue>) => {
    let config = useMemo<TableOptions<TData>>(() => {
        let _config: TableOptions<TData> = {
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            state: {},
        };
        if (filter) _config = {..._config, ...{
            getFilteredRowModel: getFilteredRowModel(),
            onColumnFiltersChange: filter[1],
            state: {..._config.state, ...{
                columnFilters: filter[0],
            }}
        }};
        if (sorting) _config = {..._config, ...{
            onSortingChange: sorting[1],
            getSortedRowModel: getSortedRowModel(),
            state: {..._config.state, ...{
                sorting: defaultSorting ? defaultSorting : sorting[0],
            }}
        }};
        if (selection) _config = {..._config, ...{ 
            onRowSelectionChange: selection[1],
            state: {..._config.state, ...{
                rowSelection: selection[0],
            }}
        }};
        if (visibility) _config = {..._config, ...{
            onColumnVisibilityChange: visibility[1],
            state: {..._config.state, ...{
                columnVisibility: visibility[0],
            }}
        }};
        if (pagination) _config = {..._config, ...{
            getPaginationRowModel: getPaginationRowModel(),
        }}
        return _config;
    }, [columns, data, filter, selection, sorting, visibility, pagination])

    console.log(config);

    const table = useReactTable(config);

    const return_footerElements = () => (
        footerElements ? footerElements(table) : <></>
    );
    const return_headerElements = () => (
        headerElements ? headerElements(table) : <></>
    )

    return (
        <>
            {return_headerElements()}
            <ScrollArea className={cn("rounded-md border", className)}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="sticky top-0 bg-background shadow-[inset_0_-2px_0_-1px_hsl(var(--border))]" style={{ width: header?.getSize() ? `${header.getSize()}rem` : "max-content" }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Keine Daten gefunden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {return_footerElements()}
        </>
    )
}
