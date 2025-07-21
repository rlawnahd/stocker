import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Stock } from '@/api/types';

interface StockTableProps {
    data: Stock[];
    stockNames?: { symbol: string; name: string }[];
    isLoading?: boolean;
}

const columnHelper = createColumnHelper<Stock>();

export default function StockTable({ data, stockNames, isLoading }: StockTableProps) {
    const navigate = useNavigate();

    // 종목명 매핑 함수 - 백엔드에서 받은 name을 우선 사용
    const getStockName = (stock: Stock) => {
        // 1. 백엔드에서 받은 name이 있으면 그것을 사용
        if (stock.name && stock.name !== stock.symbol) {
            return stock.name;
        }

        // 2. stockNames prop에서 찾기
        if (stockNames) {
            const stockInfo = stockNames.find((s) => s.symbol === stock.symbol);
            if (stockInfo) {
                return stockInfo.name;
            }
        }

        // 3. 기본값으로 symbol 반환
        return stock.symbol;
    };

    const columns: ColumnDef<Stock, any>[] = [
        columnHelper.accessor('symbol', {
            header: '종목코드',
            cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row, {
            id: 'name',
            header: '종목명',
            cell: (info) => <span className="text-gray-500">{getStockName(info.getValue())}</span>,
        }),
        columnHelper.accessor('price', {
            header: '현재가',
            cell: (info) => <span className="text-gray-900">{info.getValue().toLocaleString()}원</span>,
        }),
        columnHelper.accessor('change', {
            header: '등락',
            cell: (info) => {
                const value = info.getValue();
                return (
                    <span className={value > 0 ? 'text-red-600' : 'text-blue-600'}>
                        {value > 0 ? '+' : ''}
                        {value.toLocaleString()}원
                    </span>
                );
            },
        }),
        columnHelper.accessor('changePercent', {
            header: '등락률',
            cell: (info) => {
                const value = info.getValue();
                return (
                    <span className={value > 0 ? 'text-red-600' : 'text-blue-600'}>
                        {value > 0 ? '+' : ''}
                        {value.toFixed(2)}%
                    </span>
                );
            },
        }),
        columnHelper.accessor('volume', {
            header: '거래량',
            cell: (info) => <span className="text-gray-900">{info.getValue().toLocaleString()}</span>,
        }),
        columnHelper.accessor('dayHigh', {
            header: '고가',
            cell: (info) => <span className="text-gray-900">{info.getValue().toLocaleString()}원</span>,
        }),
        columnHelper.accessor('dayLow', {
            header: '저가',
            cell: (info) => <span className="text-gray-900">{info.getValue().toLocaleString()}원</span>,
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleRowClick = (symbol: string) => {
        navigate(`/chart/${symbol}`);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <th
                                        key={header.id}
                                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                            index < 2 ? 'text-left' : 'text-right'
                                        }`}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row.original.symbol)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={cell.id}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            index < 2 ? 'text-left' : 'text-right'
                                        }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
