import { useEffect, useState } from "react";

import { CircleArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LayoutPage from "@/layout/LayoutPage";
import TitlePage from "@/components/title-page";
import { Form } from "@/components/ui/form";
import InputSelect from "@/components/input/input-select";
import { Button } from "@/components/ui/button";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputText from "@/components/input/input-text";
import InputDateRange from "@/components/input/input-date-range";
import InputDate from "@/components/input/input-date";

const listData = [
    {
        name: 'Aktif',
    },
    {
        name: 'Nonaktif',
    },
]


export default function AddDataManagementBatch() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const [loading, setLoading] = useState(false)

    const schema = yup.object().shape({
        title: yup.string().required('Nama harus diisi!'),
        dateStart: yup.date().required('Tanggal mulai harus diisi!'),
        dateSubmit: yup.object().required('Tanggal submit harus diisi!'),
        status: yup.object().required('Status harus diisi!')
    })

    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    })

    const [dataPrint, setDataPrint] = useState()

    const onSubmit = async (data: any) => {
        setDataPrint(data);
    }

    useEffect(() => {
        form.setValue('title', 'Hello')
        form.setValue('dateStart', new Date())
        form.setValue('dateSubmit', {
            from: new Date(),
            to: new Date()
        })
        form.setValue('status', {
            name: 'Aktif'
        })
    }, [])

    return (
        <LayoutPage
            childrenHead={
                <div className="flex items-center gap-4 h-full">
                    <button onClick={handleBackClick}>
                        <CircleArrowLeft className="h-8 w-8 text-blue-pnm hover:text-blue-900" />
                    </button>
                    <TitlePage title='Tambah Batch' />
                </div>
            }
        >
            <div className='flex-col items-center w-full h-full bg-white rounded-tl-md rounded-tr-md p-4 overflow-auto'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputText
                                name="title"
                                control={form.control}
                                label="Judul"
                            />

                            <InputDate
                                control={form.control}
                                name="dateStart"
                                label="Tanggal Mulai Event"
                                disabledFuture
                            />

                            <InputDateRange
                                control={form.control}
                                name="dateSubmit"
                                label="Tanggal Periode Submit"
                                initialDateFrom={new Date()}
                                initialDateTo={new Date()}
                            />

                            <InputSelect
                                name='status'
                                control={form.control}
                                label="Status"
                                placeholder='Pilih Status'
                                loading={loading}
                                listData={listData || []}
                                renderLabel={(item: any) => item?.name}
                            />

                        </div>

                        <div className="w-full flex justify-center">
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


                <div>
                    {JSON.stringify(dataPrint)}
                </div>
            </div>
        </LayoutPage>
    )
}
