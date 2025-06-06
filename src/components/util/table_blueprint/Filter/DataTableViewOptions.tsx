import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { SlidersHorizontal } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type DataTableViewOptionsProps<TData> = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  table: Table<TData>
};

const DataTableViewOptions = <TData,>({
  table,
  className,
  ...props
}: DataTableViewOptionsProps<TData>) => {
  const { t } = useTranslation("table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-full gap-2", className)}
          {...props}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("view")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-nowrap">{t("show_columns")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* @ts-ignore */}
                {t(column.columnDef.meta?.key, { ns: column.columnDef.meta?.ns })}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableViewOptions;