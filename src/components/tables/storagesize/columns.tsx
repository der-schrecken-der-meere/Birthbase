import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type Decimal from "decimal.js"

type StorageSize = {
    name: string,
    size: string,
    raw: Decimal,
    fn: () => void
}

const columns: ColumnDef<StorageSize>[] = [
    {
        accessorKey: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomeRowsSelected() && "indeterminate")
                }
                className="align-middle"
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="align-middle"
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        )
    },
    {
        accessorKey: "name",
        header: "Speichertyp",
    },
    {
        accessorKey: "size",
        accessorFn: (data) => {
            return data.size
        },
        header: "Größe",
    }
];

export type { StorageSize };
export { columns };