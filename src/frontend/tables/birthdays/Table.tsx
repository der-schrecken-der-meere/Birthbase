import { useState } from "react";

// React Router Dom
import { useSearchParams } from "react-router-dom";

// React Redux
import { useSelector } from "react-redux";
import { RootState } from "@/frontend/store/store";

// Tanstack Table
import { ColumnFiltersState, SortDirection, SortingState, VisibilityState } from "@tanstack/react-table";

// Tableblueprints
import { DataTable }        from "@/frontend/components/table_blueprint/DataTable";
import RowsPerPage          from "@/frontend/components/table_blueprint/Pagination/RowsPerPage";
import CurrentPage          from "@/frontend/components/table_blueprint/Pagination/CurrentPage";
import Navigation           from "@/frontend/components/table_blueprint/Pagination/Navigation";
import ValueFilter          from "@/frontend/components/table_blueprint/Filter/ValueFilter";
import DataTableViewOptions from "@/frontend/components/table_blueprint/Filter/DataTableViewOptions";
import MobileTableOptions   from "@/frontend/components/table_blueprint/MobileTableOptions";

import columns from "./columns";
import { strict_OR } from "@/lib/main_util";

const Table: React.FC<React.HTMLAttributes<Pick<HTMLDivElement, "className">>> = ({
    className
}) => {
    let [searchParams] = useSearchParams();
    const birthdays = useSelector((state: RootState) => state.data.value);

    const params: [string|null,SortDirection|null] = [null, null];

    searchParams.forEach((v, k) => {
        if (k === "col") {
            if (columns.findIndex(e => v === e.id) !== -1) params[0] = v;
        } else if (k === "sort") {
            if (strict_OR<SortDirection>(v as SortDirection, "asc", "desc")) params[1] = v as SortDirection;
        }
    });

    const sorting: SortingState = [];
    if (params[0] && params[1]) {
        sorting.push({
            desc: params[1] === "desc",
            id: params[0]
        })
    }

    return (
        <DataTable
            defaultSorting={sorting}
            className={className}
            data={birthdays}
            columns={columns}
            sorting={useState<SortingState>([])}
            pagination={true}
            filter={useState<ColumnFiltersState>([])}
            visibility={useState<VisibilityState>({})}
            headerElements={(table) => (
                <div className='flex items-center py-4'>
                    <ValueFilter
                        table={table}
                        className="w-60 min-w-40 mr-2"
                        columnId="Nachname"
                        placeholder="Nachname..."
                    />
                    <DataTableViewOptions
                        className="hidden @xs:flex"
                        table={table}
                    />
                    <MobileTableOptions
                        className="flex @xs:hidden"
                        table={table}
                    />
                </div>
            )}
            footerElements={(table) => (
                <div className="flex items-center justify-between py-2 mt-auto h-12">
                    <div className="flex items-center lg:space-x-8 ml-auto">
                        <RowsPerPage
                            className="hidden @lg:flex"
                            rowsPerPage={[5, 10, 20, 30, 40, 50]}
                            table={table}
                        />
                        <CurrentPage
                            className="w-[120px] hidden @xs:block"
                            str="Seite $1 von $2"
                            table={table}
                        />
                        <Navigation
                            table={table}
                        />
                    </div>
                </div>
            )}
        />
    );
}

export default Table;