export const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR') + '원';
};

export const formatChangeRate = (rate: number): string => {
    return rate > 0 ? `+${rate.toFixed(2)}%` : `${rate.toFixed(2)}%`;
};

export const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + '백만주';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + '천주';
    }
    return volume.toString() + '주';
};
