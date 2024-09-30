{/* <InputDateRange
    onUpdate={(values: any) => form.setValue('date-range', values)}
    // initialDateFrom="2024-01-01"
    // initialDateTo="2024-12-31"
    align="start"
    locale="en-GB"
/> */}

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { DateInput } from '@/components/ui/date-input'

import { CalendarDays, ChevronDown } from 'lucide-react'

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom?: Date | string
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        // Split the date string to get year, month, and day parts
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        // If dateInput is already a Date object, return it directly
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

export default function InputDateRange({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    onUpdate,
    align = 'end',
    locale = 'en-GB',
}: DateRangePickerProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)

    const [range, setRange] = useState<DateRange>({
        from: getDateAdjustedForTimezone(initialDateFrom),
        to: initialDateTo
            ? getDateAdjustedForTimezone(initialDateTo)
            : getDateAdjustedForTimezone(initialDateFrom)
    })

    // Refs to store the values of range and rangeCompare when the date picker is opened
    const openedRangeRef = useRef<DateRange | undefined>()

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 960 : false
    )

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 960)
        }

        window.addEventListener('resize', handleResize)

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const resetValues = (): void => {
        setRange({
            from:
                typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === 'string'
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : initialDateTo
                : typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom
        })
    }

    // Helper function to check if two date ranges are equal
    const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
        if (!a || !b) return a === b // If either is undefined, return true if both are undefined
        return (
            a.from.getTime() === b.from.getTime() &&
            (!a.to || !b.to || a.to.getTime() === b.to.getTime())
        )
    }

    useEffect(() => {
        if (isOpen) {
            openedRangeRef.current = range
        }
    }, [isOpen])

    return (
        <Popover
            modal={true}
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    resetValues()
                }
                setIsOpen(open)
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="outline" className='p-0 w-full flex justify-between items-center px-3'>
                    <div className="py-1">
                        <div className='flex items-center gap-3'>
                            <CalendarDays className='w-4 h-4' />
                            <p className='mt-[2px] font-normal'>{`${formatDate(range.from, locale)}${range.to != null ? ' - ' + formatDate(range.to, locale) : 'Pick a date'}`}</p>
                        </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 shrink-0 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
            </PopoverTrigger>

            <PopoverContent align={align} className="w-auto">
                <div className="flex py-2">
                    <div className="flex">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <DateInput
                                            value={range.from}
                                            onChange={(date: any) => {
                                                const toDate =
                                                    range.to == null || date > range.to ? date : range.to
                                                setRange((prevRange) => ({
                                                    ...prevRange,
                                                    from: date,
                                                    to: toDate
                                                }))
                                            }}
                                        />
                                        <div className="py-1">-</div>
                                        <DateInput
                                            value={range.to}
                                            onChange={(date: any) => {
                                                const fromDate = date < range.from ? date : range.from
                                                setRange((prevRange) => ({
                                                    ...prevRange,
                                                    from: fromDate,
                                                    to: date
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Calendar
                                    mode="range"
                                    onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                        if (value?.from != null) {
                                            setRange({ from: value.from, to: value?.to })
                                        }
                                    }}
                                    selected={range}
                                    numberOfMonths={isSmallScreen ? 1 : 3}
                                    defaultMonth={
                                        new Date(
                                            new Date().setMonth(
                                                new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                            )
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 py-2 pr-4">
                    <Button
                        onClick={() => {
                            setIsOpen(false)
                            resetValues()
                        }}
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setIsOpen(false)
                            if (
                                !areRangesEqual(range, openedRangeRef.current)
                            ) {
                                onUpdate?.({ range })
                            }
                        }}
                    >
                        Update
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}