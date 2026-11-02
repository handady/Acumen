/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: '#fffafa',
          secondary: '#fdf5f5',
          surface: '#ffffff',
          'surface-card': 'rgba(255, 255, 255, 0.94)',
          'surface-hover': '#ffffff',
          'card-header': 'rgba(254, 242, 242, 0.7)',
          border: 'rgba(239, 68, 68, 0.12)',
          'border-hover': 'rgba(239, 68, 68, 0.32)',
          'accent-pink': '#f87171',
          'accent-pink-hover': '#ef4444',
          'text-main': '#2a1a1b',
          'text-muted': '#7d6466',
          'text-dim': '#ab9496',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'fluffy-sm': '0 2px 8px rgba(239, 68, 68, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'fluffy-md': '0 8px 24px -4px rgba(239, 68, 68, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'fluffy-lg': '0 20px 40px -8px rgba(239, 68, 68, 0.08), 0 6px 14px -2px rgba(0, 0, 0, 0.02)',
        'fluffy-glow': '0 0 24px rgba(239, 68, 68, 0.18)',
      },
      borderRadius: {
        'sm': '10px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      }
    },
  },
  plugins: [],
}
