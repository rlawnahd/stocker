import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">주식 트래커</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/stock" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-semibold mb-2">주식 목록</h2>
                    <p className="text-gray-600">전체 주식 목록을 확인하세요</p>
                </Link>
                <Link to="/watchlist" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-semibold mb-2">관심 종목</h2>
                    <p className="text-gray-600">관심 종목을 관리하세요</p>
                </Link>
                <Link to="/chart" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-semibold mb-2">차트</h2>
                    <p className="text-gray-600">주가 차트를 확인하세요</p>
                </Link>
            </div>
        </div>
    );
}
