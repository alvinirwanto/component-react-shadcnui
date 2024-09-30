import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnPinningState,
    ColumnDef,
} from '@tanstack/react-table'

import { CSSProperties, useState } from 'react'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData extends object> {
    columns: ColumnDef<TData>[];
    data: TData[];
    isLoading?: boolean;
    leftColumnPinning?: string[];
    rightColumnPinning?: string[];
    listLimit?: number[];
    paginationServer?: boolean;
    limit?: number;
    setLimit?: (value: number) => void;
    page?: number;
    setPage?: (value: number) => void;
    total_rows?: number;
    total_pages?: number;
}

export default function DataTable<TData extends object>({
    columns,
    data,
    isLoading,
    leftColumnPinning,
    rightColumnPinning,
    listLimit = [10, 20, 30, 50],
    paginationServer,
    limit,
    setLimit,
    page,
    setPage,
    total_rows,
    total_pages
}: Readonly<DataTableProps<TData>>) {

    const [filtering, setFiltering] = useState('');
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: leftColumnPinning,
        right: rightColumnPinning,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: filtering,
            columnPinning,
            ...(paginationServer && {
                pagination: {
                    pageIndex: Number(page) - 1,
                    pageSize: Number(limit)
                }
            }),
        },
        manualPagination: paginationServer,
        pageCount: paginationServer ? total_pages : undefined,
        onGlobalFilterChange: setFiltering,
        onColumnPinningChange: setColumnPinning,
    });

    const getCommonPinningStyles = (column: any) => {
        const isPinned = column?.getIsPinned()
            || (table?.getState()?.columnPinning?.left?.includes(column?.id) && 'left')
            || (table?.getState()?.columnPinning?.right?.includes(column?.id) && 'right');

        return {
            left: isPinned === 'left' ? `${column?.getStart('left')}px` : undefined,
            right: isPinned === 'right' ? `${column?.getAfter('right')}px` : undefined,
            opacity: isPinned ? 0.95 : 1,
            width: `${column?.getSize()}px`,
            backgroundColor: isPinned ? 'rgb(243 244 246)' : '',
            position: isPinned ? ('sticky' as CSSProperties['position']) : 'relative',
            zIndex: isPinned ? 10 : 0,
        }
    }

    return (
        <Card className='overflow-auto'>
            <CardContent className="p-0 h-[58vh] w-full overflow-auto">
                <Table className='overflow-auto table-fixed w-full'>
                    <TableHeader className='sticky top-0 z-50 bg-white shadow-sm w-fit'>
                        {
                            table?.getHeaderGroups()?.map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {
                                        headerGroup?.headers?.map(header => {
                                            const { column } = header;
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{ ...getCommonPinningStyles(column) }}
                                                    className='bg-gray-100'
                                                >
                                                    {
                                                        header.isPlaceholder
                                                            ? null
                                                            : (
                                                                <>
                                                                    {
                                                                        isLoading
                                                                            ? <Skeleton className="w-full h-[20px] rounded-md" />
                                                                            : flexRender(
                                                                                header.column.columnDef.header,
                                                                                header.getContext()
                                                                            )
                                                                    }
                                                                </>
                                                            )
                                                    }
                                                </TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableHeader>

                    <TableBody>
                        {
                            table?.getRowModel()?.rows?.map((row) => (
                                <TableRow key={row.id}>
                                    {
                                        row?.getVisibleCells()?.map(cell => {
                                            const { column } = cell
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{ ...getCommonPinningStyles(column) }}
                                                >
                                                    {
                                                        isLoading
                                                            ? <Skeleton className="w-full h-[20px] rounded-md" />
                                                            : flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )
                                                    }
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    ((data?.length === 0) && !isLoading) && (
                        <div className='h-[85%] grid place-items-center'>
                            <div className='flex flex-col items-center gap-3 text-gray-500'>
                                <SearchX className='h-10 w-10' />
                                <span className='text-sm'>Data tidak ditemukan</span>
                            </div>
                        </div>
                    )
                }
            </CardContent>

            <CardFooter className='border-t-2 p-3'>
                <div className="text-sm w-full">
                    {
                        paginationServer && page && limit && total_rows
                            ? <div className='hidden xl:block'>
                                Showing <strong>{(page - 1) * limit + 1}-{Math.min(page * limit, total_rows)}</strong> of <strong>{total_rows}</strong> data
                            </div>
                            : <div>
                                Showing <strong>{table?.getState()?.pagination?.pageIndex * table?.getState()?.pagination?.pageSize + 1}-{Math.min((table?.getState()?.pagination?.pageIndex + 1) * table?.getState()?.pagination?.pageSize, data?.length)}</strong> of <strong>{data?.length}</strong> data
                            </div>
                    }
                </div>
                <ol className="w-full grid grid-cols-1 xl:flex gap-3 text-sm font-medium">
                    <li className='flex w-full justify-between xl:justify-end items-center gap-4'>
                        <div>
                            {
                                paginationServer && setLimit
                                    ? <select
                                        className='rounded-md border-2 p-1 text-sm'
                                        value={limit}
                                        onChange={e => {
                                            setLimit(Number(e.target.value))
                                        }}
                                    >
                                        {listLimit.map(pageSize => (
                                            <option key={pageSize} value={pageSize}>
                                                {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                    : <select
                                        className='rounded-md border-2 p-1 text-sm'
                                        value={table?.getState()?.pagination?.pageSize}
                                        onChange={e => {
                                            table?.setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {listLimit.map(pageSize => (
                                            <option key={pageSize} value={pageSize}>
                                                {pageSize}
                                            </option>
                                        ))}
                                    </select>
                            }
                        </div>

                        <div className="hidden xl:flex items-center gap-1">
                            <div>Page</div>
                            {
                                paginationServer
                                    ? <strong>
                                        {page} from{' '} {total_pages}
                                    </strong>
                                    : <strong>
                                        {table?.getState()?.pagination?.pageIndex + 1} from{' '}
                                        {table?.getPageCount()?.toLocaleString()}
                                    </strong>
                            }
                        </div>

                        <div className="flex items-center gap-1">
                            <span>Go to page:</span>
                            {
                                paginationServer && setPage && total_pages
                                    ? <input
                                        type="number"
                                        min="1"
                                        max={total_pages}
                                        defaultValue={page}
                                        onChange={e => {
                                            const inputValue = Number(e.target.value);
                                            let page = inputValue < 1 ? 1 : (inputValue > total_pages ? total_pages : inputValue);
                                            setPage(page);
                                            e.target.value = String(page);
                                        }}
                                        className="border p-1 rounded w-14 text-center"
                                    />
                                    : <input
                                        type="number"
                                        min="1"
                                        max={table?.getPageCount() || undefined}  // Maximum page index
                                        defaultValue={table.getState()?.pagination?.pageIndex + 1 || 1}
                                        onChange={e => {
                                            const inputValue = Number(e.target.value);

                                            // Handle empty input case
                                            if (isNaN(inputValue) || inputValue < 1) {
                                                table.setPageIndex(0); // or set to a valid minimum, like 1
                                                return;
                                            }

                                            // Calculate the page based on adjusted zero-based index
                                            let page = inputValue - 1;

                                            // Clamp the page index within valid bounds
                                            const maxPages = table?.getPageCount() || 1;
                                            if (page < 0) {
                                                page = 0;
                                            } else if (page >= maxPages) {
                                                page = maxPages - 1;
                                            }

                                            table.setPageIndex(page);
                                            e.target.value = String(page + 1);
                                        }}

                                        className="border p-1 rounded w-14 text-center"
                                    />
                            }
                        </div>
                    </li>

                    <li className='flex justify-between'>
                        {
                            paginationServer && page && setPage && total_pages
                                ? <div className='flex gap-2'>
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(1)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronFirst className='h-5' />
                                    </button>

                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronLeft className='h-5' />
                                    </button>


                                    <button
                                        disabled={page === total_pages}
                                        onClick={() => setPage(page + 1)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronRight className='h-5' />
                                    </button>


                                    <button
                                        disabled={page === total_pages}
                                        onClick={() => setPage(total_pages)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronLast className='h-5' />
                                    </button>
                                </div>
                                : <div className='flex gap-2'>
                                    <button
                                        disabled={!table?.getCanPreviousPage()}
                                        onClick={() => table?.setPageIndex(0)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronFirst className='h-5' />
                                    </button>

                                    <button
                                        disabled={!table?.getCanPreviousPage()}
                                        onClick={() => table?.previousPage()}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronLeft className='h-5' />
                                    </button>


                                    <button
                                        disabled={!table?.getCanNextPage()}
                                        onClick={() => table?.nextPage()}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronRight className='h-5' />
                                    </button>


                                    <button
                                        disabled={!table?.getCanNextPage()}
                                        onClick={() => table?.setPageIndex(table?.getPageCount() - 1)}
                                        className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                    >
                                        <ChevronLast className='h-5' />
                                    </button>
                                </div>
                        }
                    </li>
                </ol>
            </CardFooter>
        </Card>
    )
}
