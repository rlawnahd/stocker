import { ChartData, KoreanStockPriceResponse, Stock, StockPrice } from '@/models/stock.model';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

// 주요 한국 주식 종목 목록
const MAIN_KOREAN_STOCKS = [
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

const POPULAR_STOCKS = [
    { symbol: '005930', name: '삼성전자' },
    { symbol: '000660', name: 'SK하이닉스' },
    { symbol: '035420', name: 'NAVER' },
    { symbol: '035720', name: '카카오' },
    { symbol: '051910', name: 'LG화학' },
];
// 임시 데이터
const mockKoreanStocks: Stock[] = [
    {
        symbol: '005930',
        name: '삼성전자',
        price: 70000,
        change: 1000,
        changePercent: 1.45,
        volume: 1000000,
        market: 'KOSPI',
        marketCap: 2000000000000,
        open: 69000,
        high: 71000,
        low: 68900,
        per: 10.5,
        pbr: 1.2,
        eps: 6666.67,
        bps: 58333.33,
    },
    {
        symbol: '035720',
        name: '카카오',
        price: 50000,
        change: -2000,
        changePercent: -3.85,
        volume: 500000,
        market: 'KOSPI',
        marketCap: 2000000000000,
        open: 52000,
        high: 52500,
        low: 49500,
        per: 25.0,
        pbr: 2.5,
        eps: 2000.0,
        bps: 20000.0,
    },
];

const mockForeignStocks: Stock[] = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 180.5,
        change: 2.5,
        changePercent: 1.4,
        volume: 5000000,
        market: 'NASDAQ',
        marketCap: 2000000000000,
        open: 178.0,
        high: 182.0,
        low: 177.5,
        per: 28.5,
        pbr: 35.2,
        eps: 6.33,
        bps: 5.13,
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 420.75,
        change: -3.25,
        changePercent: -0.77,
        volume: 3000000,
        market: 'NASDAQ',
        marketCap: 2000000000000,
        open: 424.0,
        high: 425.5,
        low: 419.0,
        per: 35.8,
        pbr: 12.4,
        eps: 11.75,
        bps: 33.93,
    },
];
dotenv.config();
// 토큰 관리 (간단한 구현)
let accessToken: string | null = null;
let tokenExpiry: number = 0;

const KIS_APP_KEY = process.env.KIS_APP_KEY;
const KIS_APP_SECRET = process.env.KIS_APP_SECRET;
const KIS_BASE_URL = 'https://openapi.koreainvestment.com:9443';

const getAccessToken = async (): Promise<string> => {
    if (!KIS_APP_KEY || !KIS_APP_SECRET) {
        throw new Error('KIS API 키가 설정되지 않았습니다.');
    }

    const now = Date.now();

    if (accessToken && now < tokenExpiry) {
        return accessToken;
    }

    try {
        const response = await axios.post(`${KIS_BASE_URL}/oauth2/tokenP`, {
            grant_type: 'client_credentials',
            appkey: KIS_APP_KEY,
            appsecret: KIS_APP_SECRET,
        });

        accessToken = response.data.access_token;
        tokenExpiry = now + response.data.expires_in * 1000 - 60000;

        console.log('✅ KIS API 토큰 발급 성공');
        return accessToken as string;
    } catch (error) {
        console.error('❌ KIS API 토큰 발급 실패:', error);
        throw new Error('토큰 발급에 실패했습니다.');
    }
};

// 기간별 시세 조회 (올바른 API)
const getKoreanStockPeriodPrice = async (symbol: string, chartType: 'D' | 'W' | 'M' = 'D'): Promise<StockPrice[]> => {
    // const token = await getAccessToken();
    // console.log(token);
    const testToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjUxOTJiNDZiLTBiOTMtNDJlOS1hNDY1LWI5MDQ2M2IyOWU1ZiIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTc1Mjg4NTY2NCwiaWF0IjoxNzUyNzk5MjY0LCJqdGkiOiJQU0l1STlHZ3FoTGFlRWtDMkNmd3QxT2k5OU1ReXFMOVNOdmkifQ.49-bo8yTh3OdDgu02oAOVnbATgsBWTQb-4m0GATxWFVs7X_QXQvOEIF6COK4P4kYzi43WHlgxgivB9gSSRkMkQ';
    // 조회 기간 계산
    const endDate = new Date();
    const startDate = new Date();

    switch (chartType) {
        case 'D': // 일봉 - 최근 100일
            startDate.setFullYear(endDate.getFullYear() - 2);
            break;
        case 'W': // 주봉 - 최근 2년 (약 100주)
            startDate.setFullYear(endDate.getFullYear() - 10);
            break;
        case 'M': // 월봉 - 최근 8년 (약 100개월)
            startDate.setFullYear(endDate.getFullYear() - 30);
            break;
    }

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    try {
        const response = await axios.get(
            `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice`,
            {
                headers: {
                    Authorization: `Bearer ${testToken}`,
                    'Content-Type': 'application/json',
                    appkey: KIS_APP_KEY,
                    appsecret: KIS_APP_SECRET,
                    tr_id: 'FHKST03010100', // 국내주식기간별시세 TR ID
                    custtype: 'P',
                },
                params: {
                    FID_COND_MRKT_DIV_CODE: 'J', // KRX
                    FID_INPUT_ISCD: symbol,
                    FID_INPUT_DATE_1: formatDate(startDate),
                    FID_INPUT_DATE_2: formatDate(endDate),
                    FID_PERIOD_DIV_CODE: chartType, // D:일봉, W:주봉, M:월봉
                    FID_ORG_ADJ_PRC: '0', // 0:수정주가, 1:원주가
                },
            }
        );
        console.log(`📊 API 응답 데이터 개수: ${response.data.output2?.length || 0}개`);
        // output 배열에서 데이터 추출
        const chartData = response.data.output2 || response.data.output;

        if (!chartData || !Array.isArray(chartData)) {
            console.error('차트 데이터가 배열이 아님:', chartData);
            return [];
        }

        return chartData
            .map((item: any) => ({
                date: item.stck_bsop_date, // 영업일자
                open: parseFloat(item.stck_oprc || '0'), // 시가
                high: parseFloat(item.stck_hgpr || '0'), // 고가
                low: parseFloat(item.stck_lwpr || '0'), // 저가
                close: parseFloat(item.stck_clpr || item.stck_prpr || '0'), // 종가
                volume: parseInt(item.acml_vol || '0'), // 거래량
            }))
            .filter((item) => item.close > 0); // 가격이 0인 데이터 제외
    } catch (error) {
        console.error('KIS API 차트 데이터 조회 실패:', error);

        // 에러 응답 상세 로깅
        if (error instanceof AxiosError) {
            console.error('에러 상태:', error.response?.status);
            console.error('에러 데이터:', error.response?.data);
        }

        throw error;
    }
};

// 개별 종목 실시간 정보 조회
const getKoreanStockInfo = async (symbol: string): Promise<Stock> => {
    const testToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjUxOTJiNDZiLTBiOTMtNDJlOS1hNDY1LWI5MDQ2M2IyOWU1ZiIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTc1Mjg4NTY2NCwiaWF0IjoxNzUyNzk5MjY0LCJqdGkiOiJQU0l1STlHZ3FoTGFlRWtDMkNmd3QxT2k5OU1ReXFMOVNOdmkifQ.49-bo8yTh3OdDgu02oAOVnbATgsBWTQb-4m0GATxWFVs7X_QXQvOEIF6COK4P4kYzi43WHlgxgivB9gSSRkMkQ';

    try {
        const response = await axios.get(`${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`, {
            headers: {
                Authorization: `Bearer ${testToken}`,
                'Content-Type': 'application/json',
                appkey: KIS_APP_KEY,
                appsecret: KIS_APP_SECRET,
                tr_id: 'FHKST01010100', // 주식현재가 시세 TR ID
                custtype: 'P',
            },
            params: {
                FID_COND_MRKT_DIV_CODE: 'J', // KRX
                FID_INPUT_ISCD: symbol,
            },
        });

        const data = response.data.output;

        // 종목명 찾기
        const stockInfo = MAIN_KOREAN_STOCKS.find((stock) => stock.symbol === symbol);

        return {
            symbol: symbol,
            name: stockInfo?.name || data.hts_kor_isnm || symbol,
            price: parseFloat(data.stck_prpr || '0'),
            change: parseFloat(data.prdy_vrss || '0'),
            changePercent: parseFloat(data.prdy_ctrt || '0'),
            volume: parseInt(data.acml_vol || '0'),
            marketCap: parseInt(data.lstn_stcn || '0'),
            market: 'KR',
            // foreignOwnership: parseFloat(data.hts_frgn_ehrt || '0'),
            dayHigh: parseFloat(data.stck_hgpr || '0'),
            dayLow: parseFloat(data.stck_lwpr || '0'),
            open: parseFloat(data.stck_oprc || '0'),
            per: parseFloat(data.per || '0'),
            pbr: parseFloat(data.pbr || '0'),
            eps: parseFloat(data.eps || '0'),
            bps: parseFloat(data.bps || '0'),
        };
    } catch (error) {
        console.error(`KIS API 종목 정보 조회 실패 (${symbol}):`, error);

        // 에러 발생 시 Mock 데이터 반환
        const stockInfo = MAIN_KOREAN_STOCKS.find((stock) => stock.symbol === symbol);
        const mockStock = mockKoreanStocks.find((stock) => stock.symbol === symbol);

        if (mockStock) {
            return {
                ...mockStock,
                name: stockInfo?.name || mockStock.name,
            };
        }

        // 기본 Mock 데이터 생성
        return {
            symbol: symbol,
            name: stockInfo?.name || symbol,
            price: 50000 + Math.random() * 50000,
            change: (Math.random() - 0.5) * 5000,
            changePercent: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 1000000) + 100000,
            marketCap: Math.floor(Math.random() * 100000000) + 10000000,
            market: 'KR',
            // foreignOwnership: Math.random() * 50,
            // dayHigh: 55000 + Math.random() * 45000,
            // dayLow: 45000 + Math.random() * 45000,
            open: 48000 + Math.random() * 54000,
            per: 10 + Math.random() * 20,
            pbr: 1 + Math.random() * 3,
            eps: 1000 + Math.random() * 5000,
            bps: 10000 + Math.random() * 40000,
        };
    }
};

// Mock 데이터 생성 함수 개선
const generateMockChartData = (symbol: string, name: string, basePrice: number, period: string): StockPrice[] => {
    const data: StockPrice[] = [];
    const today = new Date();
    let currentPrice = basePrice;

    // 기간별 일수 계산
    const getDays = (period: string) => {
        switch (period) {
            case '1W':
                return 7;
            case '1M':
                return 30;
            case '3M':
                return 90;
            case '6M':
                return 180;
            case '1Y':
                return 365;
            default:
                return 30;
        }
    };

    const days = getDays(period);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // 주말 제외
        if (date.getDay() === 0 || date.getDay() === 6) {
            continue;
        }

        const variation = (Math.random() - 0.5) * 0.1; // -5% ~ +5%
        const dayOpen = currentPrice * (1 + variation);
        const dayHigh = dayOpen * (1 + Math.random() * 0.05);
        const dayLow = dayOpen * (1 - Math.random() * 0.05);
        const dayClose = dayLow + (dayHigh - dayLow) * Math.random();

        data.push({
            date: date.toISOString().split('T')[0].replace(/-/g, ''),
            open: Math.round(dayOpen),
            high: Math.round(dayHigh),
            low: Math.round(dayLow),
            close: Math.round(dayClose),
            volume: Math.floor(Math.random() * 1000000) + 100000,
        });

        currentPrice = dayClose;
    }

    return data;
};

export const stockService = {
    async getKoreanStocks(): Promise<Stock[]> {
        // TODO: KIS API 연동
        const stocks = [...mockKoreanStocks];
        return stocks;
    },

    async getMainKoreanStocks(): Promise<Stock[]> {
        console.log('📊 주요 한국 주식 정보 조회 시작');

        if (!KIS_APP_KEY || !KIS_APP_SECRET) {
            console.log('⚠️  KIS API 키가 없어 Mock 데이터 사용');
            // Mock 데이터 생성
            return MAIN_KOREAN_STOCKS.map((stock) => {
                const mockStock = mockKoreanStocks.find((mock) => mock.symbol === stock.symbol);
                if (mockStock) {
                    return { ...mockStock, name: stock.name };
                }

                return {
                    symbol: stock.symbol,
                    name: stock.name,
                    price: 50000 + Math.random() * 50000,
                    change: (Math.random() - 0.5) * 5000,
                    changePercent: (Math.random() - 0.5) * 10,
                    volume: Math.floor(Math.random() * 1000000) + 100000,
                    marketCap: Math.floor(Math.random() * 100000000) + 10000000,
                    market: 'KR',
                    foreignOwnership: Math.random() * 50,
                    dayHigh: 55000 + Math.random() * 45000,
                    dayLow: 45000 + Math.random() * 45000,
                    open: 48000 + Math.random() * 54000,
                    per: 10 + Math.random() * 20,
                    pbr: 1 + Math.random() * 3,
                    eps: 1000 + Math.random() * 5000,
                    bps: 10000 + Math.random() * 40000,
                };
            });
        }

        try {
            // 모든 주요 종목을 병렬로 조회
            const stockPromises = MAIN_KOREAN_STOCKS.map((stock) => getKoreanStockInfo(stock.symbol));

            const stocks = await Promise.all(stockPromises);

            console.log(`✅ 주요 한국 주식 정보 조회 완료: ${stocks.length}개 종목`);
            return stocks;
        } catch (error) {
            console.error('❌ 주요 한국 주식 정보 조회 실패:', error);
            throw error;
        }
    },

    async getForeignStocks(): Promise<Stock[]> {
        // TODO: 외국 주식 API 연동
        const stocks = [...mockForeignStocks];
        return stocks;
    },

    async getStockDetail(symbol: string): Promise<Stock | null> {
        // TODO: 주식 상세 정보 API 연동
        const allStocks = [...mockKoreanStocks, ...mockForeignStocks];
        const stock = allStocks.find((s) => s.symbol === symbol);
        if (!stock) {
            throw new Error('주식을 찾을 수 없습니다.');
        }
        return stock;
    },
    // 수정된 차트 데이터 조회
    async getStockChart(symbol: string, chartType: 'D' | 'W' | 'M' = 'D'): Promise<ChartData> {
        if (!KIS_APP_KEY || !KIS_APP_SECRET) {
            console.log('API 키가 없어 Mock 데이터 사용');
            return this.getMockChartData(symbol, chartType);
        }

        try {
            const prices = await getKoreanStockPeriodPrice(symbol, chartType);

            // 주식 기본 정보 조회
            // const stockInfo = await this.getStockDetail(symbol);

            return {
                symbol,
                name: POPULAR_STOCKS.find((s) => s.symbol === symbol)?.name || symbol,
                prices: prices.reverse(), // 날짜 순으로 정렬
            };
        } catch (error) {
            console.error('실제 API 호출 실패, Mock 데이터 사용:', error);
            return this.getMockChartData(symbol, chartType);
        }
    },

    // Mock 차트 데이터 생성
    async getMockChartData(symbol: string, period: string = '1M'): Promise<ChartData> {
        const allStocks = [...mockKoreanStocks, ...mockForeignStocks];
        const stock = allStocks.find((s) => s.symbol === symbol);
        // console.log(stock);
        if (!stock) {
            throw new Error('주식을 찾을 수 없습니다.');
        }

        const chartData = generateMockChartData(symbol, stock.name, stock.price, period);
        console.log(chartData);
        return {
            symbol,
            name: stock.name,
            prices: chartData,
        };
    },
};
