import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Eye,
    Globe,
    Zap,
    ArrowRight,
    Activity,
    Users,
    Target,
} from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

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

    // 목업 데이터 (실제 데이터가 없을 때 사용)
    const mockMarketData = {
        kospi: { value: 2567.23, change: 12.45, changePercent: 0.49 },
        kosdaq: { value: 856.78, change: -8.92, changePercent: -1.03 },
        dow: { value: 38790.12, change: 156.78, changePercent: 0.41 },
        nasdaq: { value: 16248.45, change: -23.45, changePercent: -0.14 },
    };

    const mockPopularStocks = [
        { symbol: '005930', name: '삼성전자', price: 74800, change: 1200, changePercent: 1.63, volume: 12345678 },
        { symbol: '000660', name: 'SK하이닉스', price: 156800, change: -3200, changePercent: -2.0, volume: 5678901 },
        { symbol: '035420', name: 'NAVER', price: 198500, change: 3500, changePercent: 1.79, volume: 2345678 },
        { symbol: '051910', name: 'LG화학', price: 456000, change: 8000, changePercent: 1.78, volume: 1234567 },
    ];

    const displayStocks = koreanStocks?.slice(0, 4) || mockPopularStocks;

    // 여러 종목의 가격을 순환해서 타이틀에 표시
    const stocksForTitle = displayStocks.map((stock) => ({
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
    }));

    useTitle({
        stocks: stocksForTitle,
        isLoading,
        cycleInterval: 4000, // 4초마다 변경
    });

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <div className="text-red-500 text-xl font-semibold mb-2">
                        데이터를 불러오는 중 오류가 발생했습니다
                    </div>
                    <div className="text-gray-600">잠시 후 다시 시도해주세요</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-10"></div>
                <div className="relative container mx-auto px-4 py-16 lg:py-24">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            스마트한{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                투자
                            </span>
                            의 시작
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                            실시간 주식 시장 정보와 전문적인 분석 도구로
                            <br />더 나은 투자 결정을 내리세요
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/korean-stock"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                            >
                                <Globe className="w-5 h-5 mr-2" />
                                국내 주식 둘러보기
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                to="/chart/005930"
                                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-200"
                            >
                                <BarChart3 className="w-5 h-5 mr-2" />
                                차트 분석하기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Market Overview */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">실시간 시장 개요</h2>
                        <p className="text-gray-600 text-lg">주요 지수와 시장 동향을 한눈에 확인하세요</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {Object.entries(mockMarketData).map(([index, data]) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 uppercase">{index}</h3>
                                    {data.change > 0 ? (
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {data.value.toLocaleString()}
                                </div>
                                <div
                                    className={`text-sm font-medium ${
                                        data.change > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {data.change > 0 ? '+' : ''}
                                    {data.change.toFixed(2)} ({data.changePercent > 0 ? '+' : ''}
                                    {data.changePercent.toFixed(2)}%)
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Stocks */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 종목</h2>
                            <p className="text-gray-600">투자자들이 가장 많이 관심을 보이는 종목들</p>
                        </div>
                        <Link
                            to="/korean-stock"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            전체 보기
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayStocks.map((stock) => (
                            <Link
                                key={stock.symbol}
                                to={`/chart/${stock.symbol}`}
                                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {stock.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{stock.symbol}</p>
                                    </div>
                                    {stock.changePercent > 0 ? (
                                        <TrendingUp className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-6 h-6 text-red-500" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stock.price.toLocaleString()}원
                                    </div>
                                    <div
                                        className={`text-sm font-medium ${
                                            stock.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                    >
                                        {stock.change > 0 ? '+' : ''}
                                        {stock.change.toLocaleString()}원 ({stock.changePercent > 0 ? '+' : ''}
                                        {stock.changePercent.toFixed(2)}%)
                                    </div>
                                    <div className="text-xs text-gray-500">거래량: {stock.volume.toLocaleString()}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">빠른 액션</h2>
                        <p className="text-gray-600 text-lg">자주 사용하는 기능에 빠르게 접근하세요</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Link
                            to="/korean-stock"
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">국내 주식</h3>
                            <p className="text-gray-600 mb-4">국내 주요 종목의 실시간 시세와 상세 정보를 확인하세요</p>
                            <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                                바로가기
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            to="/stock"
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Activity className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">해외 주식</h3>
                            <p className="text-gray-600 mb-4">
                                글로벌 주요 종목의 실시간 시세와 글로벌 시장 동향을 파악하세요
                            </p>
                            <div className="inline-flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                                바로가기
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            to="/watchlist"
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">관심 종목</h3>
                            <p className="text-gray-600 mb-4">관심 있는 종목을 추가하고 실시간으로 모니터링하세요</p>
                            <div className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
                                바로가기
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            to="/chart"
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">차트 분석</h3>
                            <p className="text-gray-600 mb-4">종목별 주가 추이와 기술적 분석 도구를 활용하세요</p>
                            <div className="inline-flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                                바로가기
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">포트폴리오</h3>
                            <p className="text-gray-600 mb-4">내 투자 포트폴리오를 관리하고 성과를 분석하세요</p>
                            <div className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                                준비 중
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">데이터 내보내기</h3>
                            <p className="text-gray-600 mb-4">분석 결과와 차트를 이미지로 저장하세요</p>
                            <div className="inline-flex items-center text-pink-600 font-medium group-hover:text-pink-700">
                                준비 중
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">주요 기능</h2>
                        <p className="text-gray-600 text-lg">개인 투자자를 위한 실용적인 도구들</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">실시간 데이터</h3>
                            <p className="text-gray-600">국내외 주식 시장의 최신 정보를 실시간으로 확인</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">차트 분석</h3>
                            <p className="text-gray-600">일봉/주봉/월봉 차트와 기술적 지표로 투자 판단 지원</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Eye className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">개인화</h3>
                            <p className="text-gray-600">관심 종목 관리와 개인 포트폴리오 추적</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
