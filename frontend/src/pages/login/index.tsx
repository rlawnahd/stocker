import { SignIn, useAuth } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Eye, Zap, Shield, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (isSignedIn && isLoaded) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="flex min-h-screen">
                {/* 왼쪽 섹션 - 브랜딩 및 특징 */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                    {/* 배경 패턴 */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute bottom-20 left-40 w-16 h-16 bg-white rounded-full"></div>
                        <div className="absolute bottom-40 right-40 w-20 h-20 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center px-12 py-12">
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white">Stocker</h1>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                스마트한 <span className="text-yellow-300">투자</span>의 시작
                            </h2>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                실시간 주식 시장 정보와 전문적인 분석 도구로
                                <br />더 나은 투자 결정을 내리세요
                            </p>
                        </div>

                        {/* 특징 리스트 */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">실시간 데이터</h3>
                                    <p className="text-blue-100">최신 주식 시세와 시장 정보를 실시간으로 제공</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">전문적 분석</h3>
                                    <p className="text-blue-100">다양한 차트와 기술적 분석 도구로 투자 판단 지원</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">개인화 관리</h3>
                                    <p className="text-blue-100">관심 종목을 추가하고 개인 맞춤형 포트폴리오 관리</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">안전한 보안</h3>
                                    <p className="text-blue-100">엔터프라이즈급 보안으로 안전한 투자 환경 제공</p>
                                </div>
                            </div>
                        </div>

                        {/* 투자 도구 소개 */}
                        <div className="mt-12">
                            <h3 className="text-lg font-semibold text-white mb-4">주요 투자 도구</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">실시간 차트</div>
                                    <div className="text-blue-100">일봉/주봉/월봉 분석</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">관심 종목</div>
                                    <div className="text-blue-100">개인 포트폴리오 관리</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">시장 동향</div>
                                    <div className="text-blue-100">국내외 주요 지수</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">기술적 분석</div>
                                    <div className="text-blue-100">투자 판단 지원</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 섹션 - 로그인 폼 */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* 모바일 헤더 */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Stocker</h1>
                            </div>
                            <p className="text-gray-600">스마트한 투자의 시작</p>
                        </div>

                        {/* 로그인 카드 */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">환영합니다</h2>
                                    <p className="text-gray-600">계정에 로그인하여 주식 시장을 탐험하세요</p>
                                </div>

                                {/* Clerk 로그인 컴포넌트 */}
                                <div className="h-[500px] flex justify-center items-center">
                                    {isLoaded ? (
                                        <SignIn
                                            signUpUrl="/signup"
                                            appearance={{
                                                elements: {
                                                    rootBox: 'w-full',
                                                    card: 'shadow-none border-0 p-0',
                                                    headerTitle: 'text-xl font-semibold text-gray-900',
                                                    headerSubtitle: 'text-gray-600',
                                                    formButtonPrimary:
                                                        'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl',
                                                    formFieldInput:
                                                        'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                                                    formFieldLabel: 'text-sm font-medium text-gray-700 mb-2',
                                                    footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                                                    dividerLine: 'bg-gray-200',
                                                    dividerText: 'text-gray-500',
                                                    socialButtonsBlockButton:
                                                        'w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors',
                                                    socialButtonsBlockButtonText: 'text-gray-700 font-medium',
                                                },
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full">
                                            <div className="animate-pulse space-y-4">
                                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                                                <div className="h-12 bg-blue-200 rounded-xl"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 추가 정보 */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                계정이 없으신가요?{' '}
                                <Link
                                    to="/signup"
                                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    계정 만들기
                                </Link>
                            </p>
                        </div>

                        {/* 보안 정보 */}
                        <div className="mt-6 text-center">
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                                <Shield className="w-3 h-3" />
                                <span>256비트 SSL 암호화로 보호됩니다</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
