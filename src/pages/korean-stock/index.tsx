import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

// 주요 한국 주식 티커 목록
const KOREAN_STOCK_SYMBOLS = [
    { symbol: '005930', name: '삼성전자' },
    { symbol: '000660', name: 'SK하이닉스' },
    { symbol: '035420', name: 'NAVER' },
    { symbol: '035720', name: '카카오' },
    { symbol: '051910', name: 'LG화학' },
    { symbol: '207940', name: '삼성바이오로직스' },
    { symbol: '005380', name: '현대차' },
    { symbol: '068270', name: '셀트리온' },
    { symbol: '105560', name: 'KB금융' },
    { symbol: '055550', name: '신한지주' },
];

export default function KoreanStockListPage() {
    const {
        data: stocks,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['koreanStocks'],
        queryFn: async () => {
            const stockPromises = KOREAN_STOCK_SYMBOLS.map((stock) => api.getStocks(stock.symbol));
            return Promise.all(stockPromises);
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">한국 주식 목록</h1>
            <div className="bg-white rounded-lg shadow overflow-scroll">
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
                                등락
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                등락률
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                거래량
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                고가
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                저가
                            </th>
                            {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PER
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PBR
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stocks?.map((stock, index) => (
                            <tr key={stock.symbol} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {stock.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {KOREAN_STOCK_SYMBOLS[index].name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.price.toLocaleString()}원
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                                        stock.change > 0 ? 'text-red-600' : 'text-blue-600'
                                    }`}
                                >
                                    {stock.change > 0 ? '+' : ''}
                                    {stock.change.toLocaleString()}원
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                                        stock.changePercent > 0 ? 'text-red-600' : 'text-blue-600'
                                    }`}
                                >
                                    {stock.changePercent > 0 ? '+' : ''}
                                    {stock.changePercent.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.volume.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.dayHigh.toLocaleString()}원
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.dayLow.toLocaleString()}원
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.per.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {stock.pbr.toFixed(2)}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
