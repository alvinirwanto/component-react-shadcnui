import { Control, FieldValues, FieldPath } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface InputSelectProps<T> {
    name: FieldPath<FieldValues>;
    control: Control<any>;
    placeholder: string;
    label?: string;
    loading?: boolean;
    listData: T[];
    renderLabel?: (item: T) => string;
}

export default function InputSelect<T>({
    name,
    label,
    control,
    placeholder,
    listData,
    loading,
    renderLabel
}: Readonly<InputSelectProps<T>>) {
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
                        <Select
                            disabled={loading}
                            value={renderLabel ? renderLabel(field.value) : String(field.value)}
                            onValueChange={(value) => {
                                const selectedItem = listData.find(item => {
                                    return renderLabel ? renderLabel(item) === value : String(item) === value;
                                });
                                field.onChange(selectedItem);
                            }}>

                            <SelectTrigger className={cn(
                                fieldState.error && "bg-rose-100 border-rose-500"
                            )}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {listData?.map((item, index) => (
                                    <SelectItem key={index} value={renderLabel ? renderLabel(item) : String(item)}>
                                        {renderLabel ? renderLabel(item) : String(item)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
