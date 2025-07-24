import { SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Zap, Shield, CheckCircle, Users, Award } from 'lucide-react';

const SignUpPage = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (isSignedIn && isLoaded) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="flex min-h-screen">
                {/* 왼쪽 섹션 - 브랜딩 및 특징 */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
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
                                <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white">Stocker</h1>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                투자 여정을 <span className="text-yellow-300">시작</span>하세요
                            </h2>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                개인 투자자를 위한 실용적인 도구로
                                <br />더 나은 투자 결정을 내리세요
                            </p>
                        </div>

                        {/* 혜택 리스트 */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">간편한 시작</h3>
                                    <p className="text-green-100">빠른 가입으로 즉시 투자 도구 이용 가능</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">실시간 데이터</h3>
                                    <p className="text-green-100">국내외 주식 시장 실시간 정보 제공</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">전문 도구</h3>
                                    <p className="text-green-100">차트 분석, 기술적 지표 등 전문 도구 제공</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">개인화</h3>
                                    <p className="text-green-100">나만의 관심 종목과 포트폴리오 관리</p>
                                </div>
                            </div>
                        </div>

                        {/* 투자 도구 소개 */}
                        <div className="mt-12">
                            <h3 className="text-lg font-semibold text-white mb-4">주요 기능</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">차트 분석</div>
                                    <div className="text-green-100">기술적 지표 활용</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">시장 동향</div>
                                    <div className="text-green-100">주요 지수 모니터링</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">관심 종목</div>
                                    <div className="text-green-100">개인 포트폴리오</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3">
                                    <div className="font-medium text-white">데이터 내보내기</div>
                                    <div className="text-green-100">분석 결과 저장</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 섹션 - 회원가입 폼 */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* 모바일 헤더 */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Stocker</h1>
                            </div>
                            <p className="text-gray-600">투자 여정을 시작하세요</p>
                        </div>

                        {/* 회원가입 카드 */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">계정 만들기</h2>
                                    <p className="text-gray-600">개인 투자자를 위한 실용적인 도구를 경험하세요</p>
                                </div>

                                {/* Clerk 회원가입 컴포넌트 */}
                                <div className="h-[500px] flex justify-center items-center">
                                    {isLoaded ? (
                                        <SignUp
                                            signInUrl="/login"
                                            appearance={{
                                                elements: {
                                                    rootBox: 'w-full',
                                                    card: 'shadow-none border-0 p-0',
                                                    headerTitle: 'text-xl font-semibold text-gray-900',
                                                    headerSubtitle: 'text-gray-600',
                                                    formButtonPrimary:
                                                        'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl',
                                                    formFieldInput:
                                                        'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200',
                                                    formFieldLabel: 'text-sm font-medium text-gray-700 mb-2',
                                                    footerActionLink: 'text-green-600 hover:text-green-700 font-medium',
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
                                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                                                <div className="h-12 bg-green-200 rounded-xl"></div>
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
                                이미 계정이 있으신가요?{' '}
                                <Link
                                    to="/login"
                                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                                >
                                    로그인하기
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

                        {/* 약관 정보 */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-400">
                                가입 시{' '}
                                <Link to="/terms" className="text-green-600 hover:text-green-700">
                                    이용약관
                                </Link>{' '}
                                및{' '}
                                <Link to="/privacy" className="text-green-600 hover:text-green-700">
                                    개인정보처리방침
                                </Link>
                                에 동의하게 됩니다
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
