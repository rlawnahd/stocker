import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            appearance={{
                elements: {
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white transition-colors',
                },
            }}
            publishableKey={PUBLISHABLE_KEY}
        >
            <App />
        </ClerkProvider>
    </StrictMode>
);
