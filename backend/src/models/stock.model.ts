export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    market: string;
    marketCap: number;
    open?: number;
    high?: number;
    low?: number;
    per?: number;
    pbr?: number;
    eps?: number;
    bps?: number;
}

export interface StockPrice {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface ChartData {
    symbol: string;
    name: string;
    prices: StockPrice[];
}
export interface KoreanStockPriceResponse {
    stck_bsop_date: string;
    stck_oprc: string;
    stck_hgpr: string;
    stck_lwpr: string;
    stck_prpr: string;
    acml_trdv: string;
}
