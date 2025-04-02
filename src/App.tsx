import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/home';
import StockListPage from './pages/stock';
import WatchlistPage from './pages/watchlist';
import ChartPage from './pages/chart';
import KoreanStockListPage from './pages/korean-stock';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 것으로 간주
            // gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
            refetchOnWindowFocus: false, // 윈도우 포커스시 자동 갱신 비활성화
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <nav className="bg-white shadow-lg">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    <div className="flex-shrink-0 flex items-center">
                                        <Link to="/" className="text-xl font-bold text-gray-800">
                                            Stocker
                                        </Link>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        <Link
                                            to="/"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            홈
                                        </Link>
                                        <Link
                                            to="/stock"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            해외주식
                                        </Link>
                                        <Link
                                            to="/korean-stock"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            국내주식
                                        </Link>
                                        <Link
                                            to="/watchlist"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            관심종목
                                        </Link>
                                        <Link
                                            to="/chart"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            차트
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/stock" element={<StockListPage />} />
                            <Route path="/korean-stock" element={<KoreanStockListPage />} />
                            <Route path="/watchlist" element={<WatchlistPage />} />
                            <Route path="/chart" element={<ChartPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
