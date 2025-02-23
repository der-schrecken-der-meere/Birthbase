import { useState } from "react";

// React Router Dom

// Tanstack Table
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";

// Tableblueprints
import { DataTable }        from "../../util/table_blueprint/DataTable";
import RowsPerPage          from "../../util/table_blueprint/Pagination/RowsPerPage";
import CurrentPage          from "../../util/table_blueprint/Pagination/CurrentPage";
import Navigation           from "../../util/table_blueprint/Pagination/Navigation";
import ValueFilter          from "../../util/table_blueprint/Filter/ValueFilter";
import DataTableViewOptions from "../../util/table_blueprint/Filter/DataTableViewOptions";
import MobileTableOptions   from "../../util/table_blueprint/MobileTableOptions";

import columns from "./columns";
import { Birthday } from "@/database/tables/birthday/birthdays";
import { useTranslation } from "react-i18next";

const Table: React.FC<React.HTMLAttributes<Pick<HTMLDivElement, "className">> & { 
    columns: ColumnDef<Birthday>[],
    defaultSorting: SortingState,
    data: Birthday[]
}> = ({
    className,
    defaultSorting,
    data
}) => {
    const { t } = useTranslation(["pages"]);

    const sortingState = useState<SortingState>([]);
    const columnFilter = useState<ColumnFiltersState>([]);
    const visibility = useState<VisibilityState>({})
    // const birthdays = useSelector((state: RootState) => state.data.value);

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
                <div className='flex items-center mb-2'>
                    <ValueFilter
                        table={table}
                        className="w-60 min-w-40 mr-2 text-sm"
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
                <div className="flex items-center justify-between py-2 mt-auto h-12">
                    <div className="flex items-center space-x-4 @xl:space-x-8 ml-auto">
                        <RowsPerPage
                            className="hidden @lg:flex"
                            rowsPerPage={[5, 10, 20, 30, 40, 50]}
                            table={table}
                        />
                        <CurrentPage
                            className="w-[120px] hidden @xs:block"
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