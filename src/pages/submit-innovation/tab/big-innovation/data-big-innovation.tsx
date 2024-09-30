import { useEffect, useState } from 'react'
import { Filter, MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react';
import { FaFolder } from 'react-icons/fa6';
import { FormProvider, useForm } from 'react-hook-form';

import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import InputSelect from '@/components/input/input-select';
import InputText from '@/components/input/input-text';
import { ColumnDef } from '@tanstack/react-table';
import ModalWarning from '@/components/modals/modal-warning';
import useFetchData from '@/lib/use-fetch-data';
import { useAPI } from '@/api';

interface DataProps {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
}

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


export default function DataBigInnovation() {
    const [data, setData] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { getUsers } = useAPI()

    const fetchUsers = async () => {
        try {
            const response = await getUsers(page, limit);
            setData(response?.data);
            setLimit(response?.per_page);
            setPage(response?.page);
            setTotalRows(response?.total);
            setTotalPages(response?.total_pages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, limit]);

    const [modalDeleteOpen, setModalDeleteOpen] = useState(false)

    const columns: ColumnDef<DataProps>[] = [
        {
            accessorKey: "avatar",
            size: 100,
            header: () => <span className="flex justify-center">No.</span>,
            cell: ({ row, table }) => {
                const pagination = table.getState().pagination;
                const isPaginationServer = table.options.manualPagination;  // or pass this as a prop

                const rowNumber = isPaginationServer
                    ? (pagination.pageIndex * pagination.pageSize) + row.index + 1
                    : row.index + 1;

                return (
                    <div className="text-center flex justify-center items-center relative">
                        <FaFolder className='text-3xl text-blue-100 absolute z-10 -top-2' />
                        <span className='z-20 text-sm text-blue-800 font-semibold'>
                            {rowNumber}
                        </span>
                    </div>
                );
            }

        },
        {
            header: 'Nama',
            accessorKey: 'first_name',
            size: 300
        },
        {
            header: 'Nama',
            accessorKey: 'last_name',
            size: 300
        },
        {
            header: 'Email',
            accessorKey: 'email',
            size: 300
        },
        {
            accessorKey: "id",
            size: 100,
            header: () => <span className="flex justify-center">Actions</span>,
            cell: () => (
                <div className='w-full flex justify-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className='flex gap-2 cursor-pointer'>
                                <Pencil className='h-4' />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setModalDeleteOpen(true)}
                                className='flex gap-2 cursor-pointer text-rose-500 focus:bg-rose-100 focus:text-rose-500'
                            >
                                <Trash2 className='h-4' />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const form = useForm({
        mode: 'onTouched'
    })

    return (
        <>
            <div className='flex flex-col gap-3'>
                <FormProvider {...form}>
                    <form className="h-[3rem] bg-white rounded-md grid grid-cols-[1.5fr_1fr] items-center px-4">
                        <div className="w-full flex items-center">
                            <div className="flex items-center gap-4 text-muted-foreground border-r-2 pr-6">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm">Filter</span>
                            </div>

                            <div className="w-full grid grid-cols-3 gap-4 items-center scale-90">
                                <InputSelect
                                    name='divisi'
                                    control={form.control}
                                    placeholder='Divisi'
                                    listData={listData || []}
                                    renderLabel={(item: any) => item?.name}
                                />
                                <InputSelect
                                    name='status'
                                    control={form.control}
                                    placeholder='Status'
                                    listData={listData || []}
                                    renderLabel={(item: any) => item?.name}
                                />
                                <div className="flex items-center gap-2 border border-gray-200 px-3 rounded-md">
                                    <Search />
                                    <InputText
                                        control={form.control}
                                        name='event_name'
                                        placeholder='Search'
                                        className='border-none focus-visible:ring-0'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button className="h-7 w-fit text-xs bg-blue-50 text-blue-pnm border border-blue-pnm hover:text-white hover:bg-blue-pnm rounded">
                                Reset filter
                            </Button>
                        </div>
                    </form>
                </FormProvider>

                <div className="w-full h-full bg-white p-4 overflow-auto rounded-tl-md rounded-tr-md">
                    <DataTable
                        columns={columns}
                        data={data}
                        isLoading={loading}
                        rightColumnPinning={['id']}
                        listLimit={[5, 10, 20, 30, 40, 50]}
                        paginationServer
                        limit={limit}
                        setLimit={setLimit}
                        page={page}
                        setPage={setPage}
                        total_rows={totalRows}
                        total_pages={totalPages}
                    />
                </div>
            </div>

            <ModalWarning
                title='Hapus data ini?'
                description='Setelah dihapus data tidak bisa dipulihkan kembali.'
                isOpen={modalDeleteOpen}
                onClose={() => setModalDeleteOpen(false)}
                onConfirm={() => { }}
                loading={loading}
            />
        </>
    );
}
