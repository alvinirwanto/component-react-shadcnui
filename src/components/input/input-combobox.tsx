import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useRef, useState } from "react"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"
import { Label } from "../ui/label"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"



interface InputComboboxProps<T> {
    name: FieldPath<FieldValues>;
    label?: string;
    control?: Control<any>;
    loading?: boolean;
    placeholder?: string;
    noDataPlaceholder?: string;
    listData: T[];
    renderLabel: (item: T) => string;
    compareFn: (item: T, value: T | null) => boolean; // Function to compare item with the current value
    onInputChange?: (inputValue: string) => void;
}
export default function InputCombobox<T>({
    name,
    control,
    loading,
    label,
    placeholder,
    noDataPlaceholder,
    listData,
    onInputChange,
    renderLabel,
    compareFn,
}: Readonly<InputComboboxProps<T>>) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('');  // State to track input

    // Handle input change and notify parent
    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (onInputChange) {
            onInputChange(value); // Call the parent's callback with the input value
        }
    };

    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={`w-full ${label ? 'space-y-1' : 'space-y-0'}`}>
                    <FormLabel className={`${fieldState.error && "text-destructive"}`}>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Popover open={open} onOpenChange={setOpen} >
                            <PopoverTrigger asChild>
                                <Button
                                    ref={buttonRef}
                                    variant="outline"
                                    role="combobox"
                                    disabled={loading}
                                    aria-expanded={open}
                                    className={cn(
                                        fieldState.error && "bg-rose-100 border-rose-500",
                                        "w-full justify-between font-normal"
                                    )}
                                >
                                    {field.value ? renderLabel(field.value) : placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" style={{ width: buttonRef.current?.offsetWidth }}>
                                <Command>
                                    <CommandInput
                                        placeholder={placeholder}
                                        value={inputValue}
                                        onValueChange={handleInputChange}
                                    />
                                    <CommandList>
                                        <CommandEmpty>{noDataPlaceholder ?? 'Data not found'}</CommandEmpty>
                                        <CommandGroup>
                                            {listData.map((item) => (
                                                <CommandItem
                                                    className="cursor-pointer"
                                                    key={renderLabel(item)}
                                                    value={renderLabel(item)}
                                                    onSelect={() => {
                                                        field.onChange(compareFn(item, field.value) ? null : item);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            compareFn(item, field.value) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {renderLabel(item)}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
