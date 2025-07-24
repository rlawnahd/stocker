import { useEffect, useState } from 'react';

interface StockInfo {
    name: string;
    price: number;
    change?: number;
    changePercent?: number;
}

interface UseTitleOptions {
    stockName?: string;
    price?: number;
    change?: number;
    changePercent?: number;
    isLoading?: boolean;
    stocks?: StockInfo[];
    cycleInterval?: number; // 밀리초 단위
}

// const getMarketEmoji = (changePercent?: number): string => {
//     if (changePercent === undefined) return '📊';
//     if (changePercent > 2) return '🚀';
//     if (changePercent > 0) return '📈';
//     if (changePercent > -2) return '📊';
//     if (changePercent > -5) return '📉';
//     return '💥';
// };

export const useTitle = ({
    stockName,
    price,
    change,
    changePercent,
    isLoading,
    stocks,
    cycleInterval = 3000,
}: UseTitleOptions) => {
    const [currentStockIndex, setCurrentStockIndex] = useState(0);

    useEffect(() => {
        let title = 'Stocker - 주식 투자 도구';

        if (isLoading) {
            title = '로딩 중... - Stocker';
        } else if (stocks && stocks.length > 0) {
            // 여러 종목이 있는 경우 순환 표시
            const currentStock = stocks[currentStockIndex];
            // const emoji = getMarketEmoji(currentStock.changePercent);
            const priceFormatted = currentStock.price.toLocaleString();
            const changeFormatted =
                currentStock.change !== undefined
                    ? (currentStock.change > 0 ? '+' : '') + currentStock.change.toLocaleString()
                    : '';
            const percentFormatted =
                currentStock.changePercent !== undefined
                    ? (currentStock.changePercent > 0 ? '+' : '') + currentStock.changePercent.toFixed(2) + '%'
                    : '';

            if (currentStock.change !== undefined && currentStock.changePercent !== undefined) {
                title = `${currentStock.name} ${priceFormatted}원 ${changeFormatted} (${percentFormatted}) - Stocker`;
            } else {
                title = `${currentStock.name} ${priceFormatted}원 - Stocker`;
            }
        } else if (stockName && price !== undefined) {
            // 단일 종목 표시
            // const emoji = getMarketEmoji(changePercent);
            const priceFormatted = price.toLocaleString();
            const changeFormatted = change !== undefined ? (change > 0 ? '+' : '') + change.toLocaleString() : '';
            const percentFormatted =
                changePercent !== undefined ? (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%' : '';

            if (change !== undefined && changePercent !== undefined) {
                title = `${stockName} ${priceFormatted}원 ${changeFormatted} (${percentFormatted}) - Stocker`;
            } else {
                title = `${stockName} ${priceFormatted}원 - Stocker`;
            }
        }

        document.title = title;
    }, [stockName, price, change, changePercent, isLoading, stocks, currentStockIndex]);

    // 여러 종목 순환 기능
    useEffect(() => {
        if (!stocks || stocks.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentStockIndex((prev) => (prev + 1) % stocks.length);
        }, cycleInterval);

        return () => clearInterval(interval);
    }, [stocks, cycleInterval]);
};
