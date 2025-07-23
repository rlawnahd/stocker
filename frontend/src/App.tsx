import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import HomePage from './pages/home';
import WatchlistPage from './pages/watchlist';
import ChartPage from './pages/chart';
import KoreanStockListPage from './pages/korean-stock';
import StockPage from './pages/stock';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';

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

// 올바른 보호된 라우트 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();

    // Clerk이 로딩 중이면 로딩 표시
    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 로그인하지 않았으면 로그인 페이지로 리다이렉트
    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // 로그인했으면 자식 컴포넌트 렌더링
    return <>{children}</>;
}

function App() {
    const { user } = useUser();
    const userEmail = user?.emailAddresses[0].emailAddress;

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <SignedIn>
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
                                    <div className="flex items-center">
                                        <UserButton showName />
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </SignedIn>

                    <main className="py-6">
                        <Routes>
                            {/* 보호된 라우트 */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <HomePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/stock"
                                element={
                                    <ProtectedRoute>
                                        <StockPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/korean-stock"
                                element={
                                    <ProtectedRoute>
                                        <KoreanStockListPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/watchlist"
                                element={
                                    <ProtectedRoute>
                                        <WatchlistPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chart"
                                element={
                                    <ProtectedRoute>
                                        <ChartPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chart/:symbol"
                                element={
                                    <ProtectedRoute>
                                        <ChartPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />

                            {/* 기본 리다이렉트 */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
