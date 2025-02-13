import { Birthday } from "@/database/tables/birthday/birthdays";
import { DataTable } from "../../util/table_blueprint/DataTable";
import { getColumns } from "./column";
import { CSSProperties, useCallback, useMemo } from "react";
import { TableBody, TableCell, TableRow } from "../../ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { birthdaysToGroups } from "@/lib/functions/birthdays/sorting";
import { open_birthday_form_read } from "@/hooks/use_birthday_form";

const Table: React.FC<React.HTMLAttributes<Pick<HTMLDivElement, "className">> & {
    data: Birthday[],
}> = ({
    className,
    data,
}) => {

    const columns = useMemo(() => getColumns(), [])

    const groupBirhtdays = useCallback((birthdays: Row<Birthday>[]) => {
        return birthdaysToGroups(birthdays, (d) => d.original.date, "de", "Dieser Monat");
    }, [data]);

    const onRowClick = useCallback((data: Birthday) => {
        open_birthday_form_read(data);
    }, []);

    return (
        <DataTable
            className={cn(className, "relative")}
            data={data}
            columns={columns}
            // noDataFoundText={
            //     <>
            //         <div className="mb-2">Keine neuen Nachrichten</div>
            //         <span>
            //             <Button variant="outline" size="sm" onClick={openBirthdayFormAdd}>
            //                 <Calendar className="mr-2"/>
            //                 Geburtstag erstellen
            //             </Button>
            //         </span>
            //     </>
            // }
            headerScreenReaderOnly
            tbody={(rows) => {
                return (
                    <>
                        {groupBirhtdays(rows).map((group, i) => (
                            <TableBody
                                key={`group-${i}`}
                                className="before:text-center before:sticky before:top-0 before:py-2 before:w-full before:bg-secondary before:text-secondary-foreground before:content-[var(--content)] before:block"
                                style={{
                                    "--content": `'${group.month}'`,
                                } as CSSProperties}
                            >
                                {group.birthdays.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => onRowClick(row.original)}
                                        className="hover:cursor-pointer focus-within:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell key={cell.id} className={cn(index !== 0 && "sr-only", "p-0")}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ))}
                    </>
                )
            }}
        />
    );
}

export default Table;