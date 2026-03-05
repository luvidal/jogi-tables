import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname),
    css: {
        postcss: path.resolve(__dirname, '..'),
    },
})
