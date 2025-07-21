import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    server: {
        proxy: {
            '/api': {
                target: 'https://openapi.koreainvestment.com:9443',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                secure: false,
            },
        },
    },
});
