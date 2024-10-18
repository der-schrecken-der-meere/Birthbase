import { Birthday } from "@/database/tables/birthday";
import { DataTable } from "@/frontend/components/table_blueprint/DataTable";
import { getColumns } from "./column";
import { useMemo } from "react";

const Table: React.FC<React.HTMLAttributes<Pick<HTMLDivElement, "className">> & {
    data: Birthday[],
    removeElement: (id: string|number) => void; 
}> = ({
    className,
    data,
    removeElement,
}) => {

    const columns = useMemo(() => getColumns(removeElement), [])

    return (
        <DataTable
            className={className}
            data={data}
            columns={columns}
            noDataFoundText="Keine neuen Nachrichten"
        />
    );
}

export default Table;