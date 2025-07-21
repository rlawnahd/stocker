import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/api/client';
import { ChartData } from '@/api/types';

const POPULAR_STOCKS = [
    { symbol: '005930', name: '삼성전자' },
    { symbol: '000660', name: 'SK하이닉스' },
    { symbol: '035420', name: 'NAVER' },
    { symbol: '035720', name: '카카오' },
    { symbol: '051910', name: 'LG화학' },
];

const PERIOD_OPTIONS = [
    { value: 'D', label: '일봉' },
    { value: 'W', label: '주봉' },
    { value: 'M', label: '월봉' },
    { value: '1W', label: '1주' },
    { value: '1M', label: '1개월' },
    { value: '3M', label: '3개월' },
    { value: '6M', label: '6개월' },
    { value: '1Y', label: '1년' },
];

export default function ChartPage() {
    const [symbol, setSymbol] = useState('005930');
    const [period, setPeriod] = useState('1M');

    const {
        data: chartData,
        isLoading,
        error,
        refetch,
    } = useQuery<ChartData>({
        queryKey: ['stockChart', symbol, period],
        queryFn: () => api.getStockChart(symbol, period),
        enabled: !!symbol,
        retry: 1,
    });

    const formatDate = (dateString: string) => {
        // YYYYMMDD 형식을 YYYY-MM-DD로 변환
        if (dateString.length === 8) {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
        }
        return dateString;
    };

    const formatTooltipValue = (value: number) => {
        return value.toLocaleString() + '원';
    };

    const formatXAxisTick = (tickItem: string) => {
        const date = new Date(formatDate(tickItem));
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">차트 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 mb-4">차트 데이터를 불러오는 중 오류가 발생했습니다.</div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }
    console.log(chartData);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">주가 차트</h1>
                <p className="text-gray-600">실시간 주가 차트를 확인하세요</p>
            </div>

            {/* 컨트롤 패널 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">종목 선택</label>
                        <select
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {POPULAR_STOCKS.map((stock) => (
                                <option key={stock.symbol} value={stock.symbol}>
                                    {stock.name} ({stock.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {PERIOD_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => refetch()}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            새로고침
                        </button>
                    </div>
                </div>
            </div>

            {/* 차트 */}
            {chartData && chartData.prices.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {chartData.name} ({chartData.symbol})
                        </h2>
                        <p className="text-sm text-gray-500">총 {chartData.prices.length}개 데이터</p>
                    </div>

                    <div className="h-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.prices}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatXAxisTick} />
                                <YAxis
                                    domain={['dataMin - 1000', 'dataMax + 1000']}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatTooltipValue(value), '종가']}
                                    labelFormatter={(label) => `날짜: ${formatDate(label)}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="close"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={false}
                                    name="종가"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-500 text-center">차트 데이터가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
