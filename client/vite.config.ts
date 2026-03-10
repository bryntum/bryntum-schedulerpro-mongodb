import { defineConfig } from 'vite';

export default defineConfig({
    server : {
        port  : 5173,
        proxy : {
            '/api' : 'http://localhost:1339'
        }
    },
    build : {
        outDir : 'dist'
    }
});