// React Core
import React, {
    useCallback, 
    useEffect, 
    memo
} from 'react';

// Shadcn Components
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Input } from "../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"

// Tanstack
import columns from "./columns.jsx"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

// React Icons
import { MdKeyboardArrowDown } from "react-icons/md";

// Custom Provider
// import { useBirthdays } from './provider/BirthdayProvider';
// import { useBirthdayForm } from "./provider/BirthdayFormProvider";

// Database
import { db } from "../database/db.ts";
import { useDispatch, useSelector } from 'react-redux';
import { setData } from "../store/data/dataSlice.ts"

const getData = async () => {
    try {
        console.log("a");
        return await db.GET()
    } catch (e) {
        console.error(e);
    }
} 

const DataTable = memo(() => {

    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState([]);
    const [rowSelection, setRowSelection] = React.useState({});
    // const { birthdays, setBirthdays } = useBirthdays();
    

    const birthdays = useSelector((state) => state.data.value);
    const dispatch = useDispatch();


    const table = useReactTable({
        data: birthdays,
        columns,
        enableSortingRemoval: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        meta: {
            // birthdays,
            // setBirthdays,
        },
        filterFns: {
            
        },
        sortingFns: {

        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const filterOnChange = useCallback((event) => {
        table.getColumn("lastname")?.setFilterValue(event.target.value);
    }, [])

    const onCheckedChange = useCallback((columnId, value) => {
        table.getColumn(columnId).toggleVisibility(!!value);
    }, [])

    useEffect(() => {
        (async () => {
            let data = await getData();
            console.log(data);
            if (data) {
                data = [data].flat().map(b => ({
                    id: b.id,
                    name: b.name,
                    date: b.date,
                }));
            } else {
                data = [];
            }
            dispatch(setData(data));
        })()
    }, []);

    return (
        <div className='w-full'>
            <div className='flex items-center py-4'>
                <FilterInput value={table.getColumn("lastname")?.getFilterValue()} placeholder="Filter Nachname..." onChange={filterOnChange}/>
                <ColumnVisibility onCheckedChange={onCheckedChange} columns={
                    table
                        .getAllColumns()
                        .filter(
                            (column) => column.getCanHide()
                        ).map(
                            (column) => ({
                                key: column.id,
                                checked: column.getIsVisible(),
                                text: column.columnDef?.meta?.display ? column.columnDef.meta.display : column.id,
                            })
                        )
                }/>
            </div>
            <div className='rounded-md border'>
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
            </div>
            <Navigation prevPage={table.previousPage} nextPage={table.nextPage} canPrevPage={table.getCanPreviousPage} canNextPage={table.getCanNextPage}/>
        </div>
    );
});

export default DataTable;


export const Navigation = memo(({ prevPage, canPrevPage, nextPage, canNextPage }) => {
    console.log("Navigation render");

    return (
        <div className='flex items-center justify-end space-x-2 py-4'>
            <Button
                variant="outline"
                size="sm"
                onClick={() => prevPage()}
                disabled={!canPrevPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => nextPage()}
                disabled={!canNextPage()}
            >
                Next
            </Button>
        </div>
    )
});

export const FilterInput = memo(({ onChange, value, placeholder = "" }) => {
    console.log("FilterInput render")

    return (
        <Input
            placeholder={placeholder}
            value={(() => value ?? "")()}
            onChange={onChange}
            className="max-w-sm"
        />
    );
});

export const ColumnVisibility = memo(({ columns, onCheckedChange }) => {
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
                                key={column.key}
                                className="capitalize"
                                checked={column.checked}
                                onCheckedChange={(value) =>
                                    onCheckedChange(column.key, value)
                                }
                            >
                                {column.text}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
},
(prev, next) => {
    for (let i = 0; i < prev.columns.length; i++) {
        for (const prop in prev.columns[i]) {
            if (prev.columns[i][prop] !== next.columns[i][prop]) return false;
        }
    }
    return true;
}
);