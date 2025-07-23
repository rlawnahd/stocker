import { SignUp, useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const SignUpPage = () => {
    const { isSignedIn, isLoaded } = useAuth();

    // if (isSignedIn && isLoaded) {
    //     return <Navigate to="/" replace />;
    // }
    // if (!isLoaded) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">Stocker</h1>
                    <p className="text-blue-600">계정을 만들고 주식 정보를 확인하세요</p>
                </div>

                <div className="h-[600px] flex justify-center items-center">
                    {isLoaded ? (
                        <SignUp signInUrl="/login" />
                    ) : (
                        <div className="w-full max-w-sm">
                            <div className="animate-pulse rounded-lg h-[480px] bg-gray-200"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
