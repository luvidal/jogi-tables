import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{ts,tsx}',
        './dev/**/*.{html,tsx}',
    ],
    theme: { extend: {} },
    plugins: [],
}

export default config
