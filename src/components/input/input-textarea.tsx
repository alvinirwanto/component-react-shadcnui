import { Textarea } from '../ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

interface InputTextareaProps {
    control: any;
    name: string;
    loading?: boolean;
    error?: boolean;
    label?: string;
    placeholder?: string;
    rows?: number
}
export default function InputTextarea({
    control,
    name,
    loading,
    error,
    label,
    placeholder,
    rows
}: Readonly<InputTextareaProps>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            disabled={loading}
                            placeholder={placeholder}
                            rows={rows}
                            {...field}
                            className={cn(
                                fieldState.invalid || error ? 'bg-rose-100 border-rose-500' : '',
                                'text-black'
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}