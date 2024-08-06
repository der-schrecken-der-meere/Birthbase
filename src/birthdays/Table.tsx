import columns from "./columns";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";

const Table = () => {
    const birthdays = useSelector((state: RootState) => state.data.value);

    return (
        <DataTable
            data={birthdays}
            columns={columns}
            sorting={useState<SortingState>([])}
            pagination={true}
            filter={useState<ColumnFiltersState>([])}
            columnFilter={{
                columnId: "lastname",
                placeholder: "Nachname..."
            }}
            visibility={useState<VisibilityState>({})}
        />
    );
}

export default Table;