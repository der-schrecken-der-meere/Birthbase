import {
    Column,
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
} from "@tanstack/react-table"
   
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx"
import { memo, type Dispatch, type SetStateAction } from "react";
import { Input, InputProps } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
   
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filter?: [ColumnFiltersState, Dispatch<SetStateAction<ColumnFiltersState>>];
    columnFilter?: {
        columnId: string,
        placeholder?: string,
    },
    selection?: [RowSelectionState, Dispatch<SetStateAction<RowSelectionState>>];
    sorting?: [SortingState, Dispatch<SetStateAction<SortingState>>];
    visibility?: [VisibilityState, Dispatch<SetStateAction<VisibilityState>>];
    pagination?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    columnFilter,
    data,
    filter,
    selection,
    sorting,
    visibility,
    pagination,
}: DataTableProps<TData, TValue>) {
    let config: TableOptions<TData> = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {},
    };
    if (filter) config = {...config, ...{
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: filter[1],
        state: {...config.state, ...{
            columnFilters: filter[0],
        }}
    }};
    if (sorting) config = {...config, ...{
        onSortingChange: sorting[1],
        state: {...config.state, ...{
            sorting: sorting[0],
        }}
    }};
    if (selection) config = {...config, ...{ 
        onRowSelectionChange: selection[1],
        state: {...config.state, ...{
            rowSelection: selection[0],
        }}
    }};
    if (visibility) config = {...config, ...{
        onColumnVisibilityChange: visibility[1],
        state: {...config.state, ...{
            columnVisibility: visibility[0],
        }}
    }};

    const table = useReactTable(config);
   
    return (
        <div className="w-full">
            <div className='flex items-center py-4'>
                {(columnFilter && filter) && (
                    <FilterInput
                        value={table.getColumn(columnFilter.columnId)?.getFilterValue() as (string | number)}
                        placeholder={columnFilter?.placeholder}
                        onChange={(ev) => 
                            table.getColumn(columnFilter.columnId)?.setFilterValue(ev.target.value)}/>
                )}
                {visibility && (
                    <ColumnVisibility
                        columns={
                            table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                        }
                        onCheckedChange={(column) => column.toggleVisibility(!!column.getIsVisible())}
                    />
                )}
            </div>
            <ScrollArea className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
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
                                No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {pagination && (
                <Pagination
                    table={table}
                />
            )}
        </div>
    )
}

export const FilterInput = memo(({
    value,
    className,
    ...props
}: InputProps) => {
    return (
        <Input
            value={(() => value ?? "")()}
            className="max-w-sm"
            {...props}
        />
    );
});

interface I_ColumnVisibility<TData> {
    onCheckedChange: (column: Column<TData>) => void | undefined;
    columns: Column<TData>[];
}



const _columnVisibility = <TData,>({
    columns,
    onCheckedChange
}: I_ColumnVisibility<TData>) => {
    console.log("ColumnVisibility render");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    Spalten <MdKeyboardArrowDown className='ml-2 h-4 w-4'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {columns
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={() => onCheckedChange(column)}
                            >
                                {column.columnDef?.meta?.display ? column.columnDef.meta.display : column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const ColumnVisibility = memo(_columnVisibility) as typeof _columnVisibility;


interface I_Pagination<T> {
    table: T_Table<T>
}

const _pagination = <T,>({
    table,
}: I_Pagination<T>) => {
    console.log("Navigation render");

    return (
        <div className='flex items-center justify-end space-x-2 py-4'>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    )
};
export const Pagination = memo(_pagination) as typeof _pagination;