import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/StockTable';

export default function KoreanStockListPage() {
    const {
        data: stocks,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['mainKoreanStocks'],
        queryFn: async () => {
            return api.getMainKoreanStocks();
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">주식 시장</h1>
                <p className="mt-2 text-sm text-gray-600">실시간 주식 시장 정보를 확인하세요</p>
            </div>

            <Tabs defaultValue="korean" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="korean">한국 주식</TabsTrigger>
                    <TabsTrigger value="us">미국 주식</TabsTrigger>
                </TabsList>

                <TabsContent value="korean">
                    <StockTable data={stocks || []} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="us">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-500 text-center">미국 주식 정보는 준비 중입니다.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
