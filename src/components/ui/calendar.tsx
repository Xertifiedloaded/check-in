import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full  border rounded-lg shadow-sm", className)}
      classNames={{
        months: "w-full grid grid-cols-1 sm:grid-cols-2 gap-4",
        month: "w-full space-y-4",
        caption: "w-full flex justify-between items-center px-2 py-1",
        caption_label: "text-base font-semibold text-white",
        nav: "inline-flex space-x-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        ),
        table: "w-full border-separate border-spacing-1",
        head_row: "grid grid-cols-7 w-full",
        head_cell: "w-full text-xs text-gray-500 font-medium lg:text-start text-center py-2",
        row: "grid grid-cols-7 gap-2 my-2  w-full",
        cell: cn(
          "w-full text-center text-sm rounded-md hover:bg-gray-100",
          props.mode === "range"
            ? "aria-selected:bg-primary aria-selected:text-white"
            : "aria-selected:bg-primary aria-selected:text-white"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-8 p-0 font-normal hover:bg-gray-100"
        ),
        day_selected: "bg-primary text-white hover:bg-primary/90",
        day_today: "border border-primary text-primary",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-300 cursor-not-allowed",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5 text-gray-600" />,
        IconRight: () => <ChevronRight className="h-5 w-5 text-gray-600" />,
      }}
      {...props}
    />
  );
}


Calendar.displayName = "Calendar"

export { Calendar }