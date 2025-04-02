import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StockPrice {
    date: string;
    price: number;
}

export default function ChartPage() {
    const [symbol, setSymbol] = useState('AAPL');

    const { data: priceData, isLoading } = useQuery<StockPrice[]>({
        queryKey: ['stockPrice', symbol],
        queryFn: async () => {
            // TODO: 실제 API 연동
            return [
                { date: '2024-01-01', price: 150.25 },
                { date: '2024-01-02', price: 152.3 },
                { date: '2024-01-03', price: 151.8 },
                { date: '2024-01-04', price: 153.45 },
                { date: '2024-01-05', price: 154.2 },
                { date: '2024-01-06', price: 155.1 },
                { date: '2024-01-07', price: 156.3 },
            ];
        },
    });

    if (isLoading) {
        return <div className="container mx-auto p-4">로딩 중...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">주가 차트</h1>

            <div className="mb-8">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="종목 코드 입력"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
