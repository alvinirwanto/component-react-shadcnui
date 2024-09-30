import { useRef, useState } from 'react';
import { FileText, FileUp, Pencil, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface InputPhotoProps {
    name: string;
    label?: string;
    control: any;
    linkPhoto?: string;
    info: string;
    disabled?: boolean;
    fileType?: string;
}

export default function InputFile({
    name,
    control,
    label,
    linkPhoto,
    info,
    disabled,
    fileType
}: Readonly<InputPhotoProps>) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: any, onChange: any) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Set file state
            onChange(file);        // Update the form field's value
        }
    };

    const handleRemoveFile = (onChange: any) => {
        setSelectedFile(null); // Reset local file state
        onChange(null);        // Reset form field value

        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input field so that the same file can be re-uploaded
        }
    };

    const [hoverShowEdit, setHoverShowEdit] = useState(false);

    function clipText(text: string, maxLength = 30) {
        if (text.length <= maxLength) {
            return text;
        }

        const beginning = text.slice(0, maxLength / 2);
        const end = text.slice(text.length - maxLength / 2);

        return beginning + '...' + end;
    }

    return (
        <FormField
            name={name}
            control={control}
            render={({ field: { onChange, value, ...field }, fieldState }) => (
                <FormItem className={`flex flex-col ${fieldState.error ? 'mt-3 -mb-3' : 'mt-0 mb-0'}`}>
                    <FormLabel className={`${fieldState.error && "text-destructive"}`}>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <>
                            <input
                                type="file"
                                id={name}
                                disabled={disabled}
                                accept={fileType}
                                {...field}
                                ref={fileInputRef}
                                onChange={(event) => {
                                    handleFileChange(event, onChange);
                                }}
                                className='hidden'
                            />
                            <div
                                onMouseEnter={() => setHoverShowEdit(true)}
                                onMouseLeave={() => setHoverShowEdit(false)}
                                className={`relative h-[15rem] w-[15rem] xl:h-[20rem] xl:w-[20rem] rounded overflow-clip grid place-items-center p-1 
                                    ${fieldState.error ? 'border-2 border-dashed border-rose-500 bg-rose-50' : 'border-2 border-dashed border-gray-300'} 
                                    ${(hoverShowEdit) && 'bg-gray-200'}`}
                            >

                                {(hoverShowEdit && !disabled) && (
                                    selectedFile || linkPhoto ? (
                                        <div className={`absolute z-[50] w-full h-full flex items-center justify-center gap-2 text-white cursor-pointer 
                                            ${(linkPhoto || selectedFile) && 'bg-[#00000091]'}`}
                                        >
                                            <label htmlFor={name} className='flex justify-center items-center px-3 gap-2 w-[7rem] text-sm py-[.35rem] rounded transition duration-300 hover:bg-black hover:text-white text-black bg-white cursor-pointer'>
                                                <Pencil className='w-4 h-4' /><span>Edit</span>
                                            </label>

                                            {
                                                selectedFile && (
                                                    <button onClick={() => handleRemoveFile(onChange)} className='flex justify-center items-center px-3 gap-2 w-[7rem] text-sm py-[.35rem] rounded transition duration-300 bg-white hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer'>
                                                        <Trash2 className='w-4 h-4' /><span>Hapus</span>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ) : <label htmlFor={name} className='absolute z-[50] w-full h-full cursor-pointer'></label>
                                )}

                                {
                                    selectedFile
                                        ? <div className={`flex flex-col gap-6 items-center justify-center relative p-8 ${fieldState.error ? 'text-rose-500' : 'text-gray-600'}`}>
                                            <FileText className={`scale-150 xl:scale-[6] mb-4 text-blue-50 absolute z-10`} />

                                            <div className='z-30 flex flex-col items-center gap-1'>
                                                <span className='text-sm text-center text-blue-pnm font-medium'>{clipText(selectedFile?.name, 27)}</span>
                                                <p className="text-center text-gray-400 text-[9px] xl:text-xs">{clipText(selectedFile?.type, 30)}</p>
                                                <p className="text-center text-[9px] xl:text-xs max-w-[90%] font-semibold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        : <div className={`flex flex-col gap-6 xl:gap-8 items-center justify-center p-8 ${fieldState.error ? 'text-rose-500' : 'text-gray-600'}`}>
                                            <FileUp className={`scale-150 xl:scale-[2] mt-8`} />
                                            <span className='text-sm xl:text-lg font-semibold'>Upload File</span>
                                            <p className="text-center -mt-4 text-gray-400 text-[9px] xl:text-xs max-w-[90%]">{info}</p>
                                        </div>
                                }

                            </div>
                        </>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
