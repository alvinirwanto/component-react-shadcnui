import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputTextProps {
    control: any;
    name: string;
    loading?: boolean;
    type?: string;
    error?: boolean;
    label?: string;
    placeholder?: string;
    size?: string;
    className?: string;
}

export default function InputText({
    control,
    name,
    loading,
    type = 'text',
    error,
    label,
    placeholder,
    size,
    className
}: Readonly<InputTextProps>) {

    const [inputType, setInputType] = useState(type);

    const togglePasswordVisibility = () => {
        setInputType(prevType => prevType === 'password' ? 'text' : 'password');
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className={`w-full ${label ? 'space-y-1' : 'space-y-0'}`}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={inputType}
                                disabled={loading}
                                placeholder={placeholder}
                                {...field}
                                className={cn(
                                    (fieldState.error || error) && "bg-rose-100 !border-rose-500",
                                    size === 'lg' && 'h-[50px]',
                                    'text-black',
                                    className
                                )}
                            />
                            {
                                type === 'password' && (
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-[12px] top-[10px]"
                                    >
                                        {inputType === 'password' ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}
                                    </button>
                                )
                            }
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
