import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface WatchlistStock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export default function WatchlistPage() {
    const [newSymbol, setNewSymbol] = useState('');

    const { data: watchlist, isLoading } = useQuery<WatchlistStock[]>({
        queryKey: ['watchlist'],
        queryFn: async () => {
            // TODO: 실제 API 연동
            return [
                { symbol: 'AAPL', name: '애플', price: 150.25, change: 2.5, changePercent: 1.67 },
                { symbol: 'GOOGL', name: '구글', price: 2750.75, change: -15.25, changePercent: -0.55 },
            ];
        },
    });

    const handleAddStock = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 관심 종목 추가 API 연동
        setNewSymbol('');
    };

    if (isLoading) {
        return <div className="container mx-auto p-4">로딩 중...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">관심 종목</h1>

            <form onSubmit={handleAddStock} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value)}
                        placeholder="종목 코드 입력"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        추가
                    </button>
                </div>
            </form>

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
                                작업
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {watchlist?.map((stock) => (
                            <tr key={stock.symbol} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {stock.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {stock.price.toLocaleString()}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => {
                                            // TODO: 관심 종목 삭제 API 연동
                                        }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
