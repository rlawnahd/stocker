export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    market: string;
    foreignOwnership: number;
    dayHigh: number;
    dayLow: number;
    open: number;
    per: number;
    pbr: number;
    eps: number;
    bps: number;
}

export interface StockPrice {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface WatchlistStock extends Stock {
    addedAt: string;
}

// 한국 주식 정보를 위한 인터페이스
export interface KoreanStock extends Stock {
    market: 'KR';
    marketCap: number;
    foreignOwnership: number;
    dayHigh: number;
    dayLow: number;
}

// 한국투자증권 API 응답 타입
export interface KoreanStockResponse {
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

export interface KoreanStockPriceResponse {
    stck_bsop_date: string;
    stck_oprc: string;
    stck_hgpr: string;
    stck_lwpr: string;
    stck_prpr: string;
    acml_trdv: string;
}
