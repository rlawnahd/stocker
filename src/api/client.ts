import axios from 'axios';
import { Stock, StockPrice, KoreanStockPriceResponse } from './types';

const KIS_APP_KEY = import.meta.env.VITE_KIS_APP_KEY;
const KIS_APP_SECRET = import.meta.env.VITE_KIS_APP_SECRET;
const KIS_BASE_URL = '/api';

// 토큰 발급 및 관리
interface TokenInfo {
    access_token: string;
    expires_in: number;
    token_expired: string;
    last_request_time: number;
}

const TOKEN_STORAGE_KEY = 'kis_token_info';
const TOKEN_REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6시간
const TOKEN_REQUEST_INTERVAL = 60 * 1000; // 1분 (과도한 발급 방지)

const getStoredTokenInfo = (): TokenInfo | null => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
};

const setStoredTokenInfo = (tokenInfo: TokenInfo) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
};

const clearStoredTokenInfo = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const getAccessToken = async (): Promise<string> => {
    const now = Date.now();
    const storedTokenInfo = getStoredTokenInfo();
    // 1. 저장된 토큰이 있고 6시간이 지나지 않았다면 기존 토큰 반환
    if (storedTokenInfo && now - storedTokenInfo.last_request_time < TOKEN_REFRESH_INTERVAL) {
        return storedTokenInfo.access_token;
    }

    // 2. 마지막 토큰 요청으로부터 1분이 지나지 않았다면 대기
    if (storedTokenInfo && now - storedTokenInfo.last_request_time < TOKEN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
            setTimeout(resolve, TOKEN_REQUEST_INTERVAL - (now - storedTokenInfo.last_request_time))
        );
    }

    try {
        const response = await axios.post(`${KIS_BASE_URL}/oauth2/tokenP`, {
            grant_type: 'client_credentials',
            appkey: KIS_APP_KEY,
            appsecret: KIS_APP_SECRET,
        });

        const tokenInfo: TokenInfo = {
            access_token: response.data.access_token,
            expires_in: response.data.expires_in,
            token_expired: response.data.token_expired,
            last_request_time: now,
        };
        console.log('tokenInfo', tokenInfo);
        setStoredTokenInfo(tokenInfo);

        // 토큰 만료 1시간 전에 자동 갱신
        const expiresIn = response.data.expires_in * 1000;
        setTimeout(() => {
            clearStoredTokenInfo();
        }, expiresIn - 60 * 60 * 1000);

        return tokenInfo.access_token;
    } catch (error) {
        console.error('토큰 발급 실패:', error);
        throw error;
    }
};

interface StockResponse {
    stck_shrn_iscd: string;
    hts_kor_isnm: string;
    stck_prpr: string;
    prdy_vrss: string;
    prdy_ctrt: string;
    acml_trdv: string;
    mrkt_tot_amt: string;
    frgn_ntby_qty_ratio: string;
    stck_hgpr: string;
    stck_lwpr: string;
}

export const api = {
    // 주식 목록 조회 (KOSPI 상위 종목)
    async getStocks(symbol: string): Promise<Stock> {
        const token = await getAccessToken();
        try {
            const response = await axios.get(`${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    appkey: KIS_APP_KEY,
                    appsecret: KIS_APP_SECRET,
                    tr_id: 'FHKST01010100',
                    custtype: 'P',
                },
                params: {
                    FID_COND_MRKT_DIV_CODE: 'J', // KOSPI
                    FID_INPUT_ISCD: symbol, // 전체
                },
            });

            const data = response.data.output;
            return {
                symbol: data.stck_shrn_iscd,
                name: data.bstp_kor_isnm,
                price: parseFloat(data.stck_prpr),
                change: parseFloat(data.prdy_vrss),
                changePercent: parseFloat(data.prdy_ctrt),
                volume: parseInt(data.acml_vol),
                marketCap: parseInt(data.lstn_stcn),
                market: 'KR',
                foreignOwnership: parseFloat(data.hts_frgn_ehrt),
                dayHigh: parseFloat(data.stck_hgpr),
                dayLow: parseFloat(data.stck_lwpr),
                open: parseFloat(data.stck_oprc),
                per: parseFloat(data.per),
                pbr: parseFloat(data.pbr),
                eps: parseFloat(data.eps),
                bps: parseFloat(data.bps),
            };
        } catch (error) {
            console.error('주식 목록 조회 실패:', error);
            throw error;
        }
    },

    // 주식 상세 정보 조회
    async getStockDetail(symbol: string): Promise<Stock> {
        const token = await getAccessToken();
        const response = await axios.get(
            `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    appkey: KIS_APP_KEY,
                    appsecret: KIS_APP_SECRET,
                    tr_id: 'FHKST01010100',
                    custtype: 'P',
                },
                params: {
                    FID_COND_MRKT_DIV_CODE: 'J',
                    FID_COND_SCR_DIV_CODE: '005930',
                },
            }
        );

        const data = response.data.output;
        return {
            symbol,
            name: data.hts_kor_isnm,
            price: parseFloat(data.stck_prpr),
            change: parseFloat(data.prdy_vrss),
            changePercent: parseFloat(data.prdy_ctrt),
            volume: parseInt(data.acml_trdv),
            marketCap: parseInt(data.mrkt_tot_amt),
            market: 'KR',
            foreignOwnership: parseFloat(data.frgn_ntby_qty_ratio),
            dayHigh: parseFloat(data.stck_hgpr),
            dayLow: parseFloat(data.stck_lwpr),
        };
    },

    // 주가 차트 데이터 조회
    async getStockPrices(symbol: string): Promise<StockPrice[]> {
        const token = await getAccessToken();
        const response = await axios.get(`${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-chartprice`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                appkey: KIS_APP_KEY,
                appsecret: KIS_APP_SECRET,
                tr_id: 'FHKST03010400',
                custtype: 'P',
            },
            params: {
                FID_COND_MRKT_DIV_CODE: 'J',
                FID_COND_SCR_DIV_CODE: '20171',
                FID_INPUT_ISCD: symbol,
                FID_DIV_CLS_CODE: '',
                FID_BLNG_CLS_CODE: '',
                FID_TRGT_CLS_CODE: '111111111',
                FID_TRGT_EXLS_CLS_CODE: '000000',
                FID_INPUT_PRICE: '',
                FID_VOL_CNT: '',
                FID_INPUT_DATE_1: '',
                FID_INPUT_DATE_2: '',
            },
        });

        return (response.data.output as KoreanStockPriceResponse[]).map((item) => ({
            date: item.stck_bsop_date,
            open: parseFloat(item.stck_oprc),
            high: parseFloat(item.stck_hgpr),
            low: parseFloat(item.stck_lwpr),
            close: parseFloat(item.stck_prpr),
            volume: parseInt(item.acml_trdv),
        }));
    },
};
