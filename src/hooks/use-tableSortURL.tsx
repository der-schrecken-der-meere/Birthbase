import { primitive_strict_or } from "@/lib/functions/logic/or";
import { ColumnDef, RowData, SortDirection, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";

type useTableSortURLProps<TData extends RowData> = {
    columns: ColumnDef<TData>[]
}

type useTableSortURLReturn<TData extends RowData> = {
    columns: ColumnDef<TData>[]
    defaultSorting: SortingState
}

const useTableSortURL = <TData extends RowData>(
    props: useTableSortURLProps<TData>
): useTableSortURLReturn<TData> => {
    const [searchParams] = useSearchParams();

    const defaultSorting: SortingState = [];

    let columnName: string|null = null;
    let sortDirection: SortDirection|null = null;

    searchParams.forEach((value: any, key) => {
        if (key === "col") {
            if (props.columns.findIndex(column => column.id === value) !== -1) columnName = value;
        } else if (key === "sort") {
            if (primitive_strict_or<SortDirection>(value, "asc", "desc")) sortDirection = value;
        }
    });

    if (columnName && sortDirection) {
        defaultSorting[0] = {
            desc: sortDirection === "desc",
            id: columnName,
        };
    }

    return {
        columns: props.columns,
        defaultSorting
    }
};

export { useTableSortURL };