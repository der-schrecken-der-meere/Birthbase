import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DateLib, DayPicker, DropdownOption, useDayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { addMonths, getMonth, getYear, subMonths } from "date-fns"
import { format_number_to_month_lll } from "@/lib/functions/date/timezone";

export type CalendarProps = React.ComponentProps<typeof DayPicker>
export type Arr_Years = {
  label: string,
  value: string,
}[]

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      formatters={{
        formatMonthDropdown: (date, dateLib) => {
          return format_number_to_month_lll((dateLib as DateLib).options.locale as any, date.getMonth());
        },
      }}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 m-0!",
        month_caption: "flex justify-center pt-1 relative items-center w-min mx-auto",
        caption_label: "text-sm font-medium hidden",
        // nav: "space-x-1 flex items-center",
        nav: "flex items-center absolute top-6 left-0 w-full px-4",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        week_number: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] grid place-content-center",
        week_number_header: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_end: "day-range-end",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        dropdowns: "flex gap-1",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: () => {

          const { goToMonth, months } = useDayPicker();

          const onClick = React.useCallback(() => {
            goToMonth(subMonths(months[0].date, 1));
          }, [months]);

          return (
            <Button onClick={onClick} variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          );
        },
        NextMonthButton: () => {

          const { goToMonth, months } = useDayPicker();

          const onClick = React.useCallback(() => {
            goToMonth(addMonths(months[0].date, 1));
          }, [months]);

          return (
            <Button onClick={onClick} variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 ml-auto">
              <ChevronRight className="h-4 w-4" />
            </Button>
          );
        },
        Dropdown: (props) => {

          const { goToMonth, months } = useDayPicker();

          if (props.className === "rdp-months_dropdown") {
            const currentMonth = getMonth(months[0].date);

            return (
              <Select
                onValueChange={(newValue) => {
                  const newDate = months[0].date;
                  newDate.setMonth(parseInt(newValue));
                  goToMonth(newDate);
                }}
                value={(props.options as DropdownOption[])[currentMonth].value.toString()}
              >
                <SelectTrigger>
                  {(props.options as DropdownOption[])[currentMonth].label}
                </SelectTrigger>
                <SelectContent>
                  {props.options && props.options.map((selectItem) => (
                    <SelectItem key={selectItem.value} value={selectItem.value.toString()} disabled={selectItem.disabled}>
                      {selectItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          const currentYear = getYear(months[0].date);
          const yearOptions = (props.options as DropdownOption[]).find((year) => year.value === currentYear);

          return (
            <Select
              onValueChange={(newValue) => {
                const newDate = months[0].date;
                newDate.setFullYear(parseInt(newValue));
                goToMonth(newDate);
              }}
              value={(yearOptions as DropdownOption).value.toString()}
            >
              <SelectTrigger>
                {(yearOptions as DropdownOption).label}
              </SelectTrigger>
              <SelectContent>
                {props.options && props.options.map((selectItem) => (
                  <SelectItem key={selectItem.value} value={selectItem.value.toString()} disabled={selectItem.disabled}>
                    {selectItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
