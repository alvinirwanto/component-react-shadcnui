import InputCombobox from "@/components/input/input-combobox";
import InputDate from "@/components/input/input-date";
import InputDateRange from "@/components/input/input-date-range";
import InputImage from "@/components/input/input-image";
import InputSelect from "@/components/input/input-select";
import InputText from "@/components/input/input-text";
import InputTextarea from "@/components/input/input-textarea";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form"

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFile from "@/components/input/input-file";


const listData = [
    {
        name: 'Cirebon',
        live: 'Indonesia',
        profile: {
            age: 18,
            hobby: 'cook'
        }
    },
    {
        name: 'Bandung',
        live: 'Indonesia',
        profile: {
            age: 18,
            hobby: 'cook'
        }
    },
]

export default function Home() {

    const [loading, setLoading] = useState(false)

    const MAX_FILE_SIZE_10 = 10 * 1024 * 1024;

    const schema = yup.object().shape({
        fileInput: yup.mixed().required('File harus diisi!'),
    })


    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    })

    const onSubmit = async (data: any) => {
        console.log(data);
    }

    console.log(form.watch('fileInput'));

    return (
        <div className="flex flex-col gap-3 bg-white p-4 h-full overflow-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                    <div className="grid grid-cols-1 gap-6">
                        <InputCombobox
                            name="name"
                            control={form.control}
                            label="Input search"
                            placeholder="Pilih nama user"
                            loading={loading}
                            listData={listData || []}
                            renderLabel={(item) => `${item.name} from ${item.live}`}
                            compareFn={(item, value) => item?.name === value?.name}
                            onInputChange={(inputValue) => {
                                console.log("User typed:", inputValue);
                            }}
                        />
                        <InputSelect
                            name='role'
                            control={form.control}
                            label="Input Select"
                            placeholder='Pilih Role'
                            loading={loading}
                            listData={listData || []}
                            renderLabel={(item: any) => item?.name}
                        />

                        <InputText
                            name="inputtext"
                            control={form.control}
                            label="Input Text"
                        />

                        <InputTextarea
                            name="textarea"
                            control={form.control}
                            label="Input Textarea"
                            rows={10}
                        />

                        <InputDate
                            control={form.control}
                            name="dateStart"
                            label="Input Date"
                            disabledFuture
                        />

                        <InputDateRange
                            control={form.control}
                            name="dateSubmit"
                            label="Input Date Range"
                            initialDateFrom={new Date()}
                            initialDateTo={new Date()}
                        />

                        <InputImage
                            control={form.control}
                            label='Input Image'
                            name='image'
                            info="File harus bertipe .png dan berukuran maksimal ukuran 5MB"
                        />

                        <InputFile
                            control={form.control}
                            label='Input File'
                            name='fileInput'
                            fileType=".pdf, .xlsx"
                            info="File harus bertipe .pdf dan berukuran maksimal ukuran 5MB"
                        />

                    </div>
                    <div className="w-full flex justify-center mt-10 !pb-20">
                        <Button
                            disabled={loading}
                            variant='primary'
                            type="submit"
                            className="w-[200px] h-10 text-sm mb-6 flex items-center gap-3"
                        >
                            {
                                loading && <div className="loader"></div>
                            }
                            Simpan
                        </Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}
