import axios from 'axios';
import { Stock, ChartData } from './types';

const API_BASE_URL = 'http://localhost:3001/api';
// 토큰 발급 및 관리
// interface TokenInfo {
//     access_token: string;
//     expires_in: number;
//     token_expired: string;
//     last_request_time: number;
// }
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// const TOKEN_STORAGE_KEY = 'kis_token_info';
// const TOKEN_REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6시간
// const TOKEN_REQUEST_INTERVAL = 60 * 1000; // 1분 (과도한 발급 방지)

// const getStoredTokenInfo = (): TokenInfo | null => {
//     const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
//     if (!stored) return null;
//     return JSON.parse(stored);
// };

// const setStoredTokenInfo = (tokenInfo: TokenInfo) => {
//     localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
// };

// const clearStoredTokenInfo = () => {
//     localStorage.removeItem(TOKEN_STORAGE_KEY);
// };

// const getAccessToken = async (): Promise<string> => {
//     const now = Date.now();
//     const storedTokenInfo = getStoredTokenInfo();
//     // 1. 저장된 토큰이 있고 6시간이 지나지 않았다면 기존 토큰 반환
//     if (storedTokenInfo && now - storedTokenInfo.last_request_time < TOKEN_REFRESH_INTERVAL) {
//         return storedTokenInfo.access_token;
//     }

//     // 2. 마지막 토큰 요청으로부터 1분이 지나지 않았다면 대기
//     if (storedTokenInfo && now - storedTokenInfo.last_request_time < TOKEN_REQUEST_INTERVAL) {
//         await new Promise((resolve) =>
//             setTimeout(resolve, TOKEN_REQUEST_INTERVAL - (now - storedTokenInfo.last_request_time))
//         );
//     }

//     try {
//         const response = await axios.post(`${KIS_BASE_URL}/oauth2/tokenP`, {
//             grant_type: 'client_credentials',
//             appkey: KIS_APP_KEY,
//             appsecret: KIS_APP_SECRET,
//         });

//         const tokenInfo: TokenInfo = {
//             access_token: response.data.access_token,
//             expires_in: response.data.expires_in,
//             token_expired: response.data.token_expired,
//             last_request_time: now,
//         };
//         console.log('tokenInfo', tokenInfo);
//         setStoredTokenInfo(tokenInfo);

//         // 토큰 만료 1시간 전에 자동 갱신
//         const expiresIn = response.data.expires_in * 1000;
//         setTimeout(() => {
//             clearStoredTokenInfo();
//         }, expiresIn - 60 * 60 * 1000);

//         return tokenInfo.access_token;
//     } catch (error) {
//         console.error('토큰 발급 실패:', error);
//         throw error;
//     }
// };

// interface StockResponse {
//     stck_shrn_iscd: string;
//     hts_kor_isnm: string;
//     stck_prpr: string;
//     prdy_vrss: string;
//     prdy_ctrt: string;
//     acml_trdv: string;
//     mrkt_tot_amt: string;
//     frgn_ntby_qty_ratio: string;
//     stck_hgpr: string;
//     stck_lwpr: string;
// }

export const api = {
    // 주요 한국 주식 정보 조회 (최적화된 엔드포인트)
    async getMainKoreanStocks(): Promise<Stock[]> {
        const response = await apiClient.get('/stocks/korean/main');
        return response.data;
    },

    // 주가 차트 데이터 조회
    async getStockChart(symbol: string, chartType: string): Promise<ChartData> {
        const response = await apiClient.get(`/stocks/${symbol}/chart`, {
            params: {
                chartType,
            },
        });

        return response.data;
    },
};
