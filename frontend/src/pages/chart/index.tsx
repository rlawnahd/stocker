import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createChart, CandlestickSeries, HistogramSeries, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { api } from '@/api/client';
import { ChartData } from '@/api/types';
import { useTitle } from '@/hooks/useTitle';
import {
    BarChart3,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Calendar,
    Info,
    MousePointer,
    ZoomIn,
    Move,
    ChevronDown,
    Star,
    Eye,
} from 'lucide-react';

const POPULAR_STOCKS = [
    { symbol: '005930', name: '삼성전자', sector: '전자' },
    { symbol: '000660', name: 'SK하이닉스', sector: '반도체' },
    { symbol: '035420', name: 'NAVER', sector: 'IT' },
    { symbol: '035720', name: '카카오', sector: 'IT' },
    { symbol: '051910', name: 'LG화학', sector: '화학' },
    { symbol: '006400', name: '삼성SDI', sector: '전자' },
    { symbol: '207940', name: '삼성바이오로직스', sector: '바이오' },
    { symbol: '068270', name: '셀트리온', sector: '바이오' },
];

const CHART_TYPES = [
    { value: 'D', label: '일봉', description: '일별 가격 변동' },
    { value: 'W', label: '주봉', description: '주별 가격 변동' },
    { value: 'M', label: '월봉', description: '월별 가격 변동' },
];

export default function ChartPage() {
    const { symbol: urlSymbol } = useParams<{ symbol: string }>();
    const [symbol, setSymbol] = useState(urlSymbol || '005930');
    const [chartType, setChartType] = useState<'D' | 'W' | 'M'>('D');
    const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    // URL 파라미터가 변경될 때 symbol 상태 업데이트
    useEffect(() => {
        if (urlSymbol && urlSymbol !== symbol) {
            setSymbol(urlSymbol);
        }
    }, [urlSymbol, symbol]);

    const {
        data: chartData,
        isLoading,
        error,
        refetch,
    } = useQuery<ChartData>({
        queryKey: ['stockChart', symbol, chartType],
        queryFn: () => api.getStockChart(symbol, chartType),
        enabled: !!symbol,
        retry: 1,
    });

    // 선택된 종목 정보
    const selectedStock = POPULAR_STOCKS.find((stock) => stock.symbol === symbol);

    // 통합된 차트 초기화 및 데이터 설정
    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }

        // 기존 차트 정리
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
            candlestickSeriesRef.current = null;
            volumeSeriesRef.current = null;
        }

        try {
            // 차트 옵션 설정
            const chartOptions = {
                layout: {
                    textColor: '#374151',
                    background: { type: ColorType.Solid, color: '#ffffff' },
                    fontFamily: 'Inter, system-ui, sans-serif',
                },
                width: chartContainerRef.current.clientWidth,
                height: 600,
                grid: {
                    vertLines: { color: '#f3f4f6' },
                    horzLines: { color: '#f3f4f6' },
                },
                crosshair: {
                    mode: 1,
                    vertLine: {
                        color: '#3b82f6',
                        style: 2,
                    },
                    horzLine: {
                        color: '#3b82f6',
                        style: 2,
                    },
                },
                rightPriceScale: {
                    borderColor: '#e5e7eb',
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.2,
                    },
                },
                timeScale: {
                    borderColor: '#e5e7eb',
                    timeVisible: true,
                    secondsVisible: false,
                    rightOffset: 12,
                    barSpacing: 3,
                },
            };

            // 차트 생성
            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;

            // 캔들스틱 시리즈 추가
            const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#ef4444',
                downColor: '#3b82f6',
                borderVisible: false,
                wickUpColor: '#ef4444',
                wickDownColor: '#3b82f6',
            });
            candlestickSeriesRef.current = candlestickSeries;

            // 거래량 히스토그램 시리즈 추가
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: '#ef4444',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: 'volume',
            });
            volumeSeriesRef.current = volumeSeries;

            // 거래량을 별도 스케일로 표시
            chart.priceScale('volume').applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            // 데이터가 있으면 즉시 설정
            if (chartData?.prices && chartData.prices.length > 0) {
                // 날짜 변환 함수
                const convertDate = (dateString: string) => {
                    if (dateString.length === 8) {
                        return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(
                            6,
                            8
                        )}`;
                    }
                    return dateString;
                };

                // 캔들스틱 데이터 변환
                const candlestickData = chartData.prices.map((price) => ({
                    time: convertDate(price.date),
                    open: price.open,
                    high: price.high,
                    low: price.low,
                    close: price.close,
                }));

                // 거래량 데이터 변환
                const volumeData = chartData.prices.map((price) => ({
                    time: convertDate(price.date),
                    value: price.volume,
                    color: price.close >= price.open ? '#ef4444' : '#3b82f6',
                }));

                // 데이터 설정
                candlestickSeries.setData(candlestickData);
                volumeSeries.setData(volumeData);

                // 차트를 데이터에 맞게 조정
                chart.timeScale().fitContent();
            }
        } catch (error) {
            console.error('차트 생성/데이터 설정 오류:', error);
        }

        // 리사이즈 이벤트 처리
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                candlestickSeriesRef.current = null;
                volumeSeriesRef.current = null;
            }
        };
    }, [chartData]);

    const formatDate = (dateString: string) => {
        if (dateString.length === 8) {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
        }
        return dateString;
    };

    // 최신 가격 정보 계산
    const getLatestPriceInfo = () => {
        if (!chartData?.prices || chartData.prices.length === 0) return null;

        const latest = chartData.prices[chartData.prices.length - 1];
        const previous = chartData.prices[chartData.prices.length - 2];

        if (!previous) return null;

        const change = latest.close - previous.close;
        const changePercent = (change / previous.close) * 100;

        return {
            price: latest.close,
            change,
            changePercent,
            high: latest.high,
            low: latest.low,
            volume: latest.volume,
        };
    };

    const latestPriceInfo = getLatestPriceInfo();

    // 타이틀 업데이트
    useTitle({
        stockName: selectedStock?.name,
        price: latestPriceInfo?.price,
        change: latestPriceInfo?.change,
        changePercent: latestPriceInfo?.changePercent,
        isLoading,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[600px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">차트 데이터를 불러오는 중</h3>
                            <p className="text-gray-600">잠시만 기다려주세요...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[600px]">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-6">⚠️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                데이터를 불러오는 중 오류가 발생했습니다
                            </h3>
                            <p className="text-gray-600 mb-6">오류: {error.message}</p>
                            <button
                                onClick={() => refetch()}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                다시 시도
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* 헤더 섹션 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">주가 차트 분석</h1>
                            <p className="text-lg text-gray-600">
                                실시간 차트와 기술적 분석 도구로 투자 판단을 돕습니다
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Star className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* 종목 정보 카드 */}
                    {selectedStock && latestPriceInfo && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                            <BarChart3 className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedStock.name}</h2>
                                            <p className="text-gray-500">
                                                {selectedStock.symbol} • {selectedStock.sector}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {latestPriceInfo.price.toLocaleString()}원
                                        </div>
                                        <div
                                            className={`text-lg font-semibold flex items-center justify-center ${
                                                latestPriceInfo.change > 0 ? 'text-red-600' : 'text-blue-600'
                                            }`}
                                        >
                                            {latestPriceInfo.change > 0 ? (
                                                <TrendingUp className="w-4 h-4 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 mr-1" />
                                            )}
                                            {latestPriceInfo.change > 0 ? '+' : ''}
                                            {latestPriceInfo.change.toLocaleString()}원
                                        </div>
                                        <div
                                            className={`text-sm font-medium ${
                                                latestPriceInfo.changePercent > 0 ? 'text-red-600' : 'text-blue-600'
                                            }`}
                                        >
                                            ({latestPriceInfo.changePercent > 0 ? '+' : ''}
                                            {latestPriceInfo.changePercent.toFixed(2)}%)
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">고가</div>
                                        <div className="font-semibold text-gray-900">
                                            {latestPriceInfo.high.toLocaleString()}원
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">저가</div>
                                        <div className="font-semibold text-gray-900">
                                            {latestPriceInfo.low.toLocaleString()}원
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-gray-500">거래량</div>
                                        <div className="font-semibold text-gray-900">
                                            {latestPriceInfo.volume.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 컨트롤 패널 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 종목 선택 */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">종목 선택</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsStockDropdownOpen(!isStockDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">{selectedStock?.name}</div>
                                            <div className="text-sm text-gray-500">{selectedStock?.symbol}</div>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                            isStockDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {isStockDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                                        {POPULAR_STOCKS.map((stock) => (
                                            <button
                                                key={stock.symbol}
                                                onClick={() => {
                                                    setSymbol(stock.symbol);
                                                    setIsStockDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <BarChart3 className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{stock.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {stock.symbol} • {stock.sector}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 차트 타입 선택 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">차트 타입</label>
                            <div className="flex space-x-2">
                                {CHART_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setChartType(type.value as 'D' | 'W' | 'M')}
                                        className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                                            chartType === type.value
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">{type.label}</div>
                                            <div
                                                className={`text-xs ${
                                                    chartType === type.value ? 'text-blue-100' : 'text-gray-500'
                                                }`}
                                            >
                                                {type.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 새로고침 버튼 */}
                        <div className="flex items-end">
                            <button
                                onClick={() => refetch()}
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                새로고침
                            </button>
                        </div>
                    </div>
                </div>

                {/* 차트 컨테이너 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {chartData && chartData.prices.length > 0 ? (
                        <>
                            {/* 차트 헤더 */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {chartData.name} ({chartData.symbol})
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {CHART_TYPES.find((t) => t.value === chartType)?.label}
                                            </span>
                                            <span>총 {chartData.prices.length}개 데이터</span>
                                            {chartData.prices.length > 0 && (
                                                <span>
                                                    {formatDate(chartData.prices[0].date)} ~{' '}
                                                    {formatDate(chartData.prices[chartData.prices.length - 1].date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 차트 컨트롤 힌트 */}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <MousePointer className="w-3 h-3" />
                                            <span>상세정보</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <ZoomIn className="w-3 h-3" />
                                            <span>확대/축소</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Move className="w-3 h-3" />
                                            <span>이동</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 차트 영역 */}
                            <div className="p-6">
                                <div
                                    ref={chartContainerRef}
                                    className="w-full h-[600px] rounded-lg border border-gray-200"
                                />

                                {/* 차트 범례 */}
                                <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                        <span className="text-gray-600">상승</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                                        <span className="text-gray-600">하락</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                                        <span className="text-gray-600">거래량</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">차트 데이터가 없습니다</h3>
                            <p className="text-gray-600 mb-6">다른 종목을 선택하거나 새로고침을 눌러보세요.</p>
                            <button
                                onClick={() => refetch()}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                새로고침
                            </button>
                        </div>
                    )}
                </div>

                {/* 추가 기능 섹션 */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">기술적 분석</h3>
                        </div>
                        <p className="text-gray-600 text-sm">이동평균, RSI, MACD 등 다양한 기술적 지표를 활용한 분석</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Info className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">기본 분석</h3>
                        </div>
                        <p className="text-gray-600 text-sm">PER, PBR, ROE 등 기업 가치를 평가하는 기본 지표 분석</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">관심 종목</h3>
                        </div>
                        <p className="text-gray-600 text-sm">관심 있는 종목을 추가하여 실시간 모니터링</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
