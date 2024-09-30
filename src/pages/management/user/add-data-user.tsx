import { useState } from "react";

import { CircleArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LayoutPage from "@/layout/LayoutPage";
import TitlePage from "@/components/title-page";
import { Form } from "@/components/ui/form";
import InputSelect from "@/components/input/input-select";
import { Button } from "@/components/ui/button";
import InputCombobox from "@/components/input/input-combobox";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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


export default function AddDataManagementUser() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const [loading, setLoading] = useState(false)

    const schema = yup.object().shape({
        name: yup.object().required('Nama harus diisi!'),
        role: yup.object().required('Role harus diisi!'),
        juri: yup.object().required('Juri harus diisi!'),
        status: yup.object().required('Status harus diisi!')
    })

    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    })

    const onSubmit = async (data: any) => {
        console.log(data);
    }

    return (
        <LayoutPage
            childrenHead={
                <div className="flex items-center gap-4 h-full">
                    <button onClick={handleBackClick}>
                        <CircleArrowLeft className="h-8 w-8 text-blue-pnm hover:text-blue-900" />
                    </button>
                    <TitlePage title='Tambah User' />
                </div>
            }
        >
            <div className='flex-col items-center w-full h-full bg-white rounded-tl-md rounded-tr-md p-4 overflow-auto'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-6">
                            <InputCombobox
                                name="name"
                                control={form.control}
                                label="Nama"
                                placeholder="Pilih nama user"
                                loading={loading}
                                // noDataPlaceholder="No people found"
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
                                label="Role"
                                placeholder='Pilih Role'
                                loading={loading}
                                listData={listData || []}
                                renderLabel={(item: any) => item?.name}
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
            </div>
        </LayoutPage>
    )
}
