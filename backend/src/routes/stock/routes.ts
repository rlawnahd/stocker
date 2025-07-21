import { Router } from 'express';
import { stockService } from '../../services/stock.service';

const router = Router();

// 한국 주식 목록 조회
router.get('/korean', async (req, res) => {
    try {
        const stocks = await stockService.getKoreanStocks();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: '주식 정보를 가져오는데 실패했습니다.' });
    }
});

// 주요 한국 주식 목록 조회 (최적화된 엔드포인트)
router.get('/korean/main', async (req, res) => {
    try {
        const stocks = await stockService.getMainKoreanStocks();
        res.json(stocks);
    } catch (error) {
        console.error('주요 한국 주식 조회 실패:', error);
        res.status(500).json({ message: '주요 주식 정보를 가져오는데 실패했습니다.' });
    }
});

// 해외 주식 목록 조회
router.get('/foreign', async (req, res) => {
    try {
        const stocks = await stockService.getForeignStocks();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: '주식 정보를 가져오는데 실패했습니다.' });
    }
});

// 특정 주식 상세 정보 조회
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const stock = await stockService.getStockDetail(symbol);
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: '주식 정보를 가져오는데 실패했습니다.' });
    }
});

// 개선된 차트 데이터 조회
router.get('/:symbol/chart', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { chartType = 'D' } = req.query;

        console.log(`차트 데이터 요청: ${symbol}, 기간: ${chartType}`);

        const chartData = await stockService.getStockChart(symbol, chartType as 'D' | 'W' | 'M');
        console.log(`차트 데이터 응답: ${chartData.prices.length}개 데이터`);

        res.json(chartData);
    } catch (error) {
        console.error('차트 데이터 조회 실패:', error);

        // 구체적인 에러 메시지 반환
        const errorMessage = error instanceof Error ? error.message : '차트 데이터를 가져오는데 실패했습니다.';

        res.status(500).json({
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error : {},
        });
    }
});
export const stockRoutes = router;
