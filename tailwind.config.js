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
          primary: '#fdf8f7',
          secondary: '#fbf2f0',
          surface: '#ffffff',
          'surface-card': 'rgba(255, 255, 255, 0.95)',
          'surface-hover': '#ffffff',
          'card-header': 'rgba(253, 242, 240, 0.75)',
          border: 'rgba(235, 172, 168, 0.28)',
          'border-hover': 'rgba(235, 140, 135, 0.5)',
          'accent-pink': '#f87171',
          'accent-pink-hover': '#ef4444',
          'text-main': '#3e2b2d',
          'text-muted': '#7a6365',
          'text-dim': '#a68e90',
        },
        rose: {
          50: '#fff5f5',
          100: '#fde8e7',
          200: '#fbd0ce',
          300: '#f8a8a4',
          400: '#f57a74',
          500: '#ee534c',
          600: '#dc3730',
          700: '#b82923',
        },
        sage: {
          50: '#f2f8f5',
          100: '#edf7f2',
          500: '#2d8a68',
          600: '#237355',
          700: '#1a5942',
        },
        apricot: {
          50: '#fef7f2',
          100: '#fdf4ed',
          500: '#c26d2d',
          600: '#a8591e',
          700: '#8c4412',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'fluffy-sm': '0 2px 10px rgba(225, 120, 115, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'fluffy-md': '0 10px 28px -4px rgba(225, 120, 115, 0.07), 0 3px 8px -1px rgba(0, 0, 0, 0.02)',
        'fluffy-lg': '0 22px 46px -8px rgba(225, 120, 115, 0.09), 0 8px 16px -2px rgba(0, 0, 0, 0.02)',
        'fluffy-glow': '0 0 28px rgba(248, 113, 113, 0.15)',
      },
      borderRadius: {
        'sm': '12px',
        'md': '18px',
        'lg': '26px',
        'xl': '34px',
      }
    },
  },
  plugins: [],
}
