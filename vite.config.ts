import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        tailwindcss(),
        topLevelAwait(),
    ],
    server: {
        open: '/.',
    },
});
