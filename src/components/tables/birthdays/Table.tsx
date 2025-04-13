import type { Birthday } from "@/database/tables/birthday/birthdays";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";

import { useState } from "react";

import { DataTable }        from "../../util/table_blueprint/DataTable";
import RowsPerPage          from "../../util/table_blueprint/Pagination/RowsPerPage";
import CurrentPage          from "../../util/table_blueprint/Pagination/CurrentPage";
import Navigation           from "../../util/table_blueprint/Pagination/Navigation";
import ValueFilter          from "../../util/table_blueprint/Filter/ValueFilter";
import DataTableViewOptions from "../../util/table_blueprint/Filter/DataTableViewOptions";
import MobileTableOptions   from "../../util/table_blueprint/MobileTableOptions";

import { useTranslation } from "react-i18next";

import columns from "./columns";

const Table: React.FC<React.HTMLAttributes<Pick<HTMLDivElement, "className">> & { 
    columns: ColumnDef<Birthday>[],
    defaultSorting: SortingState,
    data: Birthday[]
}> = ({
    className,
    defaultSorting,
    data
}) => {
    const sortingState = useState<SortingState>([]);
    const columnFilter = useState<ColumnFiltersState>([]);
    const visibility = useState<VisibilityState>({});

    const { t } = useTranslation(["pages"]);

    return (
        <DataTable
            defaultSorting={defaultSorting}
            className={className}
            data={data}
            columns={columns}
            sorting={sortingState}
            pagination={true}
            filter={columnFilter}
            visibility={visibility}
            headerElements={(table) => (
                <div className='flex items-center mb-2 gap-2 justify-between'>
                    <ValueFilter
                        table={table}
                        className="w-60 min-w-40 text-sm"
                        columnId="lastname"
                        placeholder={t("my_birthdays.last_name")}
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
                <div className="flex items-center justify-end py-2 mt-auto h-12">
                    <div className="flex items-center gap-8">
                        <RowsPerPage
                            className="hidden @lg:flex"
                            rowsPerPage={[5, 10, 20, 30, 40, 50]}
                            table={table}
                        />
                        <CurrentPage
                            className="hidden @xs:block"
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
};

export default Table;