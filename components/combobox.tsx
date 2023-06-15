import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboBoxProps = {
  data: { value: string; label: string }[] | undefined
  onChange: ({ value, label }: { value: string; label: string }) => void
  className?: string
  defaultToFirst?: boolean
  selectText?: string
  searchText?: string
  disabledText?: string
  notFoundText?: string
}

const buttonRef = React.createRef<HTMLButtonElement>()

export function ComboBox({
  data,
  searchText,
  selectText,
  onChange,
  disabledText,
  notFoundText,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [popoverWidth, setPopoverWidth] = React.useState<string>("200px")

  React.useLayoutEffect(() => {
    if (open) {
      const buttonWidth = buttonRef.current?.offsetWidth
      setPopoverWidth(`${buttonWidth}px`)
    }
  }, [open])

  const onSelect = (currentValue: string, id: string): void => {
    setValue(currentValue)
    onChange({ value: id, label: currentValue })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          disabled={!data}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
        >
          {!data
            ? disabledText
            : value
            ? data.find(
                (option) => option.label.toLowerCase() === value.toLowerCase()
              )?.label
            : selectText ?? "Select an option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" style={{ width: popoverWidth }}>
        <Command>
          <CommandInput placeholder={searchText ?? "Search an option..."} />
          <CommandEmpty>{notFoundText ?? "No option found."}</CommandEmpty>
          <CommandGroup>
            {data?.map((option) => (
              <CommandItem
                className="capitalize"
                key={option.value}
                onSelect={(label) => onSelect(label, option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
