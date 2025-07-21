import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/home';
import WatchlistPage from './pages/watchlist';
import ChartPage from './pages/chart';
import KoreanStockListPage from './pages/korean-stock';
import StockPage from './pages/stock';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 것으로 간주
            // gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
            // refetchOnWindowFocus: false, // 윈도우 포커스시 자동 갱신 비활성화
        },
    },
});

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {children}
        </Link>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <nav className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    <div className="flex-shrink-0 flex items-center">
                                        <Link to="/" className="text-xl font-bold text-blue-600">
                                            Stocker
                                        </Link>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                        <NavLink to="/">홈</NavLink>
                                        <NavLink to="/korean-stock">국내주식</NavLink>
                                        <NavLink to="/stock">해외주식</NavLink>
                                        <NavLink to="/watchlist">관심종목</NavLink>
                                        <NavLink to="/chart">차트</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="py-6">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/stock" element={<StockPage />} />
                            <Route path="/korean-stock" element={<KoreanStockListPage />} />
                            <Route path="/watchlist" element={<WatchlistPage />} />
                            <Route path="/chart" element={<ChartPage />} />
                            <Route path="/chart/:symbol" element={<ChartPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
