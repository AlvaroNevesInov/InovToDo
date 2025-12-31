import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
        tailwindcss(),
    ],
    build: {
        // Minificação otimizada com terser
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log em produção
                drop_debugger: true, // Remove debugger em produção
            },
        },
        // Code splitting otimizado
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separar vendor code (Vue, Alpine, etc.)
                    'vendor': ['vue'],
                },
                // Nomear chunks de forma consistente
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        // Aumentar limite de aviso de chunk size
        chunkSizeWarningLimit: 1000,
        // Sourcemaps apenas em desenvolvimento
        sourcemap: false,
    },
    // Otimizações de performance
    optimizeDeps: {
        include: ['vue'],
    },
});
