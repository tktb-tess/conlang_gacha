import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
    base: '/conlang_gacha/',
    plugins: [
        react(),
        tailwindcss(),
        topLevelAwait(),
    ],
    server: {
        open: '/.',
        port: 8000,
    },
    preview: {
        port: 4000,
    }
})
