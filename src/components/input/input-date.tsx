import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import react-hook-form's Controller
import { cn } from "@/lib/utils";

interface InputDateProps {
    control: any;
    name: string;
    loading?: boolean;
    type?: string;
    error?: boolean;
    label?: string;
    placeholder?: string;
    size?: string;
    disabledFuture?: boolean;
    className?: string;
}

export default function InputDate({
    control,
    name,
    loading,
    disabledFuture,
    label,
}: Readonly<InputDateProps>) {

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [displayedMonth, setDisplayedMonth] = useState(new Date(selectedYear, selectedMonth));
    const [isOpen, setIsOpen] = useState(false);

    const handleYearChange = (year: string) => {
        setSelectedYear(Number(year));
        const newDate = new Date(Number(year), selectedMonth);
        setDisplayedMonth(newDate);  // Update the displayed month
    };

    // Handle month change from Select
    const handleMonthChange = (month: string) => {
        setSelectedMonth(Number(month));
        const newDate = new Date(selectedYear, Number(month));
        setDisplayedMonth(newDate);  // Update the displayed month
    };

    // Handle month change from Calendar navigation (Next/Prev buttons)
    const handleCalendarMonthChange = (newMonth: Date) => {
        setSelectedYear(newMonth.getFullYear());
        setSelectedMonth(newMonth.getMonth());
        setDisplayedMonth(newMonth);  // Sync the displayed month with calendar
    };

    const formatDate = (date: Date, locale: string = 'en-GB'): string => {
        return date.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover
                        modal={true}
                        open={isOpen}
                        onOpenChange={(open: boolean) => {
                            setIsOpen(open);
                        }}
                    >
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    className={cn(
                                        fieldState.error && "bg-rose-100 border-rose-500",
                                        "w-full flex justify-start items-center font-normal gap-3 px-3"
                                    )}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    <span className='mt-[2px] font-normal'>
                                        {field.value ? formatDate(field.value, 'en-GB') : "Pilih Tanggal"}
                                    </span>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            style={{
                                maxHeight: "var(--radix-popover-content-available-height)",
                                overflowY: "auto",
                            }}
                            className="flex w-auto flex-col space-y-2 p-2 scale-[0.85] -mt-[30px] -ml-[23px]"
                        >
                            <div className="flex items-center space-x-2">
                                <Select onValueChange={handleYearChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedYear.toString()} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <SelectItem key={i} value={(2020 + i).toString()}>
                                                {2020 + i}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={handleMonthChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="rounded-md border">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date);
                                    }}
                                    month={displayedMonth}
                                    onMonthChange={handleCalendarMonthChange}
                                    fromYear={2020}
                                    toYear={2030}
                                    disabled={(date) => {
                                        const isBefore2024 = date < new Date("2024-01-01");
                                        const isFutureDate = disabledFuture ? date > new Date() : false;  // Conditionally disable future dates
                                        return isBefore2024 || isFutureDate;  // Return true if the date is disabled
                                    }}
                                />
                            </div>
                            <div className='flex justify-end !mt-4'>
                                <Button
                                    className='w-fit h-fit'
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                >
                                    Update
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
            )}
        />
    );
}
