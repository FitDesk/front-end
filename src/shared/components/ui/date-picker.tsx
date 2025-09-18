import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/core/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export function DatePicker({
  selected,
  onChange,
  className,
  minDate,
  maxDate,
}: {
  selected: Date | undefined
  onChange: (date: Date | undefined) => void
  className?: string
  minDate?: Date
  maxDate?: Date
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onChange}
          initialFocus
          fromDate={minDate}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  )
}
