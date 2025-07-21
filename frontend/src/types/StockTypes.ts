export interface StockInfo {
    stockCode: string;
    stockName: string;
    currentPrice: number;
    changeRate: number;
    changeAmount: number;
    volume: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
}

export interface StockSearchResult {
    stockCode: string;
    stockName: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}
