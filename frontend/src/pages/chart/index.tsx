import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createChart, CandlestickSeries, HistogramSeries, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { api } from '@/api/client';
import { ChartData } from '@/api/types';

const POPULAR_STOCKS = [
    { symbol: '005930', name: '삼성전자' },
    { symbol: '000660', name: 'SK하이닉스' },
    { symbol: '035420', name: 'NAVER' },
    { symbol: '035720', name: '카카오' },
    { symbol: '051910', name: 'LG화학' },
];

const CHART_TYPES = [
    { value: 'D', label: '일봉' },
    { value: 'W', label: '주봉' },
    { value: 'M', label: '월봉' },
];

export default function ChartPage() {
    const { symbol: urlSymbol } = useParams<{ symbol: string }>();
    const [symbol, setSymbol] = useState(urlSymbol || '005930');
    const [chartType, setChartType] = useState<'D' | 'W' | 'M'>('D');
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

    // 통합된 차트 초기화 및 데이터 설정
    useEffect(() => {
        console.log('=== 통합 차트 처리 시작 ===');
        console.log('chartContainerRef.current:', !!chartContainerRef.current);
        console.log('chartData:', !!chartData);
        console.log('chartData?.prices:', chartData?.prices?.length);

        // 컨테이너가 준비되지 않았으면 대기
        if (!chartContainerRef.current) {
            console.log('❌ 차트 컨테이너가 준비되지 않음');
            return;
        }

        // 기존 차트 정리
        if (chartRef.current) {
            console.log('🧹 기존 차트 정리');
            chartRef.current.remove();
            chartRef.current = null;
            candlestickSeriesRef.current = null;
            volumeSeriesRef.current = null;
        }

        console.log('📊 새 차트 생성 시작');

        try {
            // 차트 옵션 설정
            const chartOptions = {
                layout: {
                    textColor: 'black',
                    background: { type: ColorType.Solid, color: 'white' },
                },
                width: chartContainerRef.current.clientWidth,
                height: 500,
                grid: {
                    vertLines: { color: '#f0f0f0' },
                    horzLines: { color: '#f0f0f0' },
                },
                crosshair: {
                    mode: 1,
                },
                rightPriceScale: {
                    borderColor: '#cccccc',
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: false,
                },
            };

            // 차트 생성
            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;
            console.log('✅ 차트 생성 완료');

            // 캔들스틱 시리즈 추가
            const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#fd0400',
                downColor: '#2e37e9',
                borderVisible: false,
                wickUpColor: '#fd0400',
                wickDownColor: '#2e37e9',
            });
            candlestickSeriesRef.current = candlestickSeries;
            console.log('✅ 캔들스틱 시리즈 생성 완료');

            // 거래량 히스토그램 시리즈 추가
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: '#fd0400',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: 'volume',
            });
            volumeSeriesRef.current = volumeSeries;
            console.log('✅ 거래량 시리즈 생성 완료');

            // 거래량을 별도 스케일로 표시
            chart.priceScale('volume').applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            // 데이터가 있으면 즉시 설정
            if (chartData?.prices && chartData.prices.length > 0) {
                console.log('📈 데이터 즉시 설정 시작');

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
                    color: price.close >= price.open ? '#fd0400' : '#2e37e9',
                }));

                console.log('📊 데이터 변환 완료:', {
                    candlestickCount: candlestickData.length,
                    volumeCount: volumeData.length,
                    firstData: candlestickData[0],
                    lastData: candlestickData[candlestickData.length - 1],
                });

                // 데이터 설정
                candlestickSeries.setData(candlestickData);
                volumeSeries.setData(volumeData);

                // 차트를 데이터에 맞게 조정
                chart.timeScale().fitContent();

                console.log('✅ 데이터 설정 완료');
            } else {
                console.log('⏳ 데이터 대기 중...');
            }
        } catch (error) {
            console.error('❌ 차트 생성/데이터 설정 오류:', error);
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
    }, [chartData]); // chartData가 변경될 때마다 차트 재생성

    const formatDate = (dateString: string) => {
        if (dateString.length === 8) {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
        }
        return dateString;
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
                    <p className="text-sm text-gray-500 mb-4">오류: {error.message}</p>
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">주가 차트</h1>
                <p className="text-gray-600">일봉, 주봉, 월봉 차트를 확인하세요</p>
            </div>

            {/* 디버깅 정보 패널 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-xs">
                <h3 className="font-semibold mb-2">디버깅 정보:</h3>
                <div className="grid grid-cols-3 gap-2">
                    <div>데이터 로딩: {isLoading ? '🔄' : '✅'}</div>
                    <div>데이터 존재: {chartData ? '✅' : '❌'}</div>
                    <div>가격 데이터: {chartData?.prices?.length || 0}개</div>
                    <div>차트 생성: {chartRef.current ? '✅' : '❌'}</div>
                    <div>캔들 시리즈: {candlestickSeriesRef.current ? '✅' : '❌'}</div>
                    <div>거래량 시리즈: {volumeSeriesRef.current ? '✅' : '❌'}</div>
                </div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">차트 타입</label>
                        <div className="flex space-x-2">
                            {CHART_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setChartType(type.value as 'D' | 'W' | 'M')}
                                    className={`px-4 py-2 rounded-md border transition-colors ${
                                        chartType === type.value
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => refetch()}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            새로고침
                        </button>
                    </div>
                </div>
            </div>

            {/* 차트 컨테이너 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {chartData && chartData.prices.length > 0 ? (
                    <>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {chartData.name} ({chartData.symbol}) -{' '}
                                {CHART_TYPES.find((t) => t.value === chartType)?.label}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>총 {chartData.prices.length}개 데이터</span>
                                {chartData.prices.length > 0 && (
                                    <span>
                                        기간: {formatDate(chartData.prices[0].date)} ~{' '}
                                        {formatDate(chartData.prices[chartData.prices.length - 1].date)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <div ref={chartContainerRef} className="w-full h-[500px] border border-gray-200 rounded" />

                            <div className="mt-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                                        <span>상승</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                        <span>하락</span>
                                    </div>
                                    <span>• 마우스를 올려 상세 정보 확인</span>
                                    <span>• 마우스 휠로 확대/축소</span>
                                    <span>• 드래그로 차트 이동</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">차트 데이터가 없습니다.</p>
                        <p className="text-sm text-gray-400 mt-2">다른 종목을 선택하거나 새로고침을 눌러보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
