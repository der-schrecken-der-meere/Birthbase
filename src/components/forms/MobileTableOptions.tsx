import { RowData, Table } from "@tanstack/react-table";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import { RowsPerPageSelect } from "../util/table_blueprint/Pagination/RowsPerPage";
import { useTranslation } from "react-i18next";

const ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50];

const formSchema = z.object({
    columns: z.array(z.object({
        columnName: z.string(),
        visibility: z.boolean(),
        meta: z.object({
            ns: z.string(),
            key: z.string(),
        })
    })),
    rowsPerPage: z.coerce.number(),
});

type FormSchema = z.infer<typeof formSchema>
type MobileTableOptionsProps<TData extends RowData> = {
    table: Table<TData>
    onSubmitClick?: () => void
}

const MobileTableOptionsForm = <TData extends RowData>({
    table,
    onSubmitClick,
}: MobileTableOptionsProps<TData>) => {

    const canHideColumns = table
        .getAllColumns()
        .filter(
            (column) => 
            typeof column.accessorFn !== "undefined" && column.getCanHide()
        );

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rowsPerPage: table.getState().pagination.pageSize,
            columns: canHideColumns.map((column) => ({
                columnName: column.id,
                visibility: column.getIsVisible(),
                meta: column.columnDef.meta,
            })),
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = (data) => {
        table.setPageSize(data.rowsPerPage);
        data.columns.forEach((column, index) => {
            canHideColumns[index].toggleVisibility(!!column.visibility);
        })
        if (onSubmitClick) {
            onSubmitClick();
        }
    }

    const { t } = useTranslation(["table", "generally"]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="columns"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("columns")}
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col gap-2">
                                {field.value.map((column, index) => (
                                    <ColumnFormCheckbox
                                        key={column.columnName}
                                        value={column.visibility}
                                        id={column.columnName}
                                        columnName={t(column.meta.key, { ns: column.meta.ns })}
                                        onCheckedChange={(value) => {
                                            const newArray = [...field.value];
                                            newArray[index].visibility = value;
                                            field.onChange(newArray);
                                        }}
                                    />
                                ))}
                                </div>
                            </FormControl>
                            <FormDescription>
                                {t("columns_description")}
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rowsPerPage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("rows_per_page")}
                            </FormLabel>
                            <FormControl>
                                <RowsPerPageSelect
                                    table={table}
                                    rowsPerPage={ROWS_PER_PAGE}
                                    onValueChange={field.onChange}
                                    value={field.value + ""}
                                />
                            </FormControl>
                            <FormDescription>
                                {t("rows_per_page_description")}
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting || !form.formState.isDirty} type="submit" variant="outline">
                    {t("save_btn", { ns: "generally" })}
                </Button>
            </form>
        </Form>
    )
};

type ColumnFormCheckboxProps = {
    value: boolean
    onCheckedChange: (value: boolean) => void
    id: any
    columnName: string
}

const ColumnFormCheckbox = ({
   value,
   onCheckedChange,
   id,
   columnName,
}: ColumnFormCheckboxProps) => {
    return (
        <div className="flex items-center gap-2">
            <Checkbox
                checked={value}
                onCheckedChange={onCheckedChange}
                id={`m-c-${id}`}
            />
            <Label htmlFor={`m-c-${id}`} className="font-normal">
                {columnName}
            </Label>
        </div>
    );
};

export { MobileTableOptionsForm, ROWS_PER_PAGE };