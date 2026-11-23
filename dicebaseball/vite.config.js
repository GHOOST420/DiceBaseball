import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/DiceBaseball/',
    plugins: [plugin()],
    server: {
        port: 58309,
    }
})