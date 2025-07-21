import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { stockRoutes } from './routes/stock/routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// 미들웨어
app.use(
    cors({
        origin: process.env.NODE_ENV === 'production' ? 'https://stocker.com' : 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());

// 라우트
app.use('/api/stocks', stockRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'Stocker API 서버가 실행 중입니다.' });
});

// 에러 핸들링
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
