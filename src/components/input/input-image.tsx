import { useRef, useState } from 'react';
import { CloudUpload, ImageUp, Pencil, Trash2 } from 'lucide-react';
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

export default function InputImage({
    name,
    control,
    label,
    linkPhoto,
    info,
    disabled,
    fileType
}: Readonly<InputPhotoProps>) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (event: any, onChange: any) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onChange(file);
        }
    };

    const handleRemoveImage = (onChange: any) => {
        setSelectedImage(null);
        onChange(null);

        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the input value
        }
    };

    const [hoverShowEdit, setHoverShowEdit] = useState(false);

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
                                accept={fileType ?? '.png, .jpg, .jpeg'}
                                {...field}
                                ref={fileInputRef}
                                onChange={(event) => {
                                    handleImageChange(event, onChange);
                                }}
                                className='hidden'
                            />
                            <div
                                onMouseEnter={() => setHoverShowEdit(true)}
                                onMouseLeave={() => setHoverShowEdit(false)}
                                className={`relative h-[15rem] w-[15rem] xl:h-[20rem] xl:w-[20rem] rounded overflow-clip grid place-items-center p-1 
                                    ${fieldState.error ? 'border-2 border-dashed border-rose-500 bg-rose-50' : 'border-2 border-dashed border-gray-300'} 
                                    ${(hoverShowEdit && (!selectedImage || !linkPhoto)) && 'bg-gray-200'}`
                                }
                            >
                                {(hoverShowEdit && !disabled) && (
                                    selectedImage || linkPhoto ? (
                                        <div className={`absolute z-[50] w-full h-full flex items-center justify-center gap-2 text-white cursor-pointer 
                                            ${(linkPhoto || selectedImage) && 'bg-[#00000091]'}`}
                                        >
                                            <label htmlFor={name} className='flex justify-center items-center px-3 gap-2 w-[7rem] text-sm py-[.35rem] rounded transition duration-300 hover:bg-black hover:text-white text-black bg-white cursor-pointer'>
                                                <Pencil className='w-4 h-4' /><span>Edit</span>
                                            </label>

                                            {
                                                selectedImage && (
                                                    <button onClick={() => handleRemoveImage(onChange)} className='flex justify-center items-center px-3 gap-2 w-[7rem] text-sm py-[.35rem] rounded transition duration-300 bg-white hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer'>
                                                        <Trash2 className='w-4 h-4' /><span>Hapus</span>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ) : <label htmlFor={name} className='absolute z-[50] w-full h-full cursor-pointer'></label>
                                )}
                                {
                                    selectedImage || linkPhoto ? (
                                        <img
                                            src={selectedImage ?? linkPhoto}
                                            alt='img-input'
                                            className='relative z-[20] rounded h-full w-full object-cover border-2 border-gray-100'
                                        />
                                    ) : (
                                        <div className={`flex flex-col gap-6 xl:gap-8 items-center justify-center p-8 ${fieldState.error ? 'text-rose-500' : 'text-gray-600'}`}>
                                            <ImageUp className={`scale-150 xl:scale-[2] mt-8`} />
                                            <span className='text-sm xl:text-lg font-semibold'>Upload Foto</span>
                                            <p className="text-center -mt-4 text-gray-400 text-[9px] xl:text-xs max-w-[90%]">{info}</p>
                                        </div>
                                    )
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
