import { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import Navigation from "./Pagination/Navigation"
import CurrentPage from "./Pagination/CurrentPage"
import RowsPerPage from "./Pagination/RowsPerPage"
import SelectedRows from "./Pagination/SelectedRows"

type DataTablePaginationProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>,
  className?: string,
}

export default function DataTablePagination<TData>({
  table,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)} {...props}>
      <SelectedRows
        table={table}
      />
      <div className="flex items-center space-x-8 ml-auto">
        <RowsPerPage
          className="hidden sm:flex"
          rowsPerPage={[5, 10, 20, 30, 40, 50]}
          table={table}
        />
        <CurrentPage
          className="w-[120px]"
          table={table}
        />
        <Navigation
          table={table}
        />
      </div>
    </div>
  )
}
