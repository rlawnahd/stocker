import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Stock } from '@/api/types';

export default function StockListPage() {
    const {
        data: stocks,
        isLoading,
        error,
    } = useQuery<Stock[]>({
        queryKey: ['stocks'],
        queryFn: api.getStocks,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">주식 목록</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                종목코드
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                종목명
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                현재가
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                변동
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                등락률
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                거래량
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stocks?.map((stock) => (
                            <tr key={stock.symbol} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {stock.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    ${stock.price.toLocaleString()}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                        stock.change >= 0 ? 'text-red-600' : 'text-blue-600'
                                    }`}
                                >
                                    {stock.change >= 0 ? '+' : ''}
                                    {stock.change.toLocaleString()}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                        stock.changePercent >= 0 ? 'text-red-600' : 'text-blue-600'
                                    }`}
                                >
                                    {stock.changePercent >= 0 ? '+' : ''}
                                    {stock.changePercent.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {stock.volume.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
