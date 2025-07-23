import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import StockTable from '@/components/StockTable';

export default function HomePage() {
    const {
        data: koreanStocks,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['mainKoreanStocks'],
        queryFn: async () => {
            return api.getMainKoreanStocks();
        },
    });

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900">주식 트래커</h1>
                <p className="mt-2 text-lg text-gray-600">실시간 주식 시장 정보를 한눈에 확인하세요</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 주요 시장 섹션 */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">주요 시장</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    to="/korean-stock"
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <h3 className="text-lg font-medium text-gray-900">한국 주식</h3>
                                    <p className="mt-1 text-sm text-gray-600">국내 주요 종목 실시간 시세</p>
                                </Link>
                                <Link
                                    to="/stock"
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <h3 className="text-lg font-medium text-gray-900">해외 주식</h3>
                                    <p className="mt-1 text-sm text-gray-600">글로벌 주요 종목 실시간 시세</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 관심 종목 섹션 */}
                <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">관심 종목</h2>
                            <Link
                                to="/watchlist"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="text-lg font-medium text-gray-900">관심 종목 관리</h3>
                                <p className="mt-1 text-sm text-gray-600">관심 종목 추가 및 모니터링</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 차트 섹션 */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">차트 분석</h2>
                            <Link
                                to="/chart"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="text-lg font-medium text-gray-900">주가 차트</h3>
                                <p className="mt-1 text-sm text-gray-600">종목별 주가 추이 및 기술적 분석</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 주요 종목 시세 */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">주요 종목 시세</h2>
                        {/* <StockTable data={koreanStocks || []} isLoading={isLoading} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
