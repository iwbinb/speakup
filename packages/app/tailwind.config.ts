import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0a0f1c',
          800: '#1a2235',
          700: '#2c3650',
          500: '#5a6680',
          400: '#7a86a0',
          300: '#a9b3c8',
          200: '#d4daea',
          100: '#eef1f8',
          50: '#f6f8fa',
        },
        brand: {
          DEFAULT: '#00c853',
          dark: '#00a843',
          soft: '#e6f9ee',
        },
        accent: {
          warn: '#f59e0b',
          danger: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 15, 28, 0.04), 0 4px 16px rgba(10, 15, 28, 0.06)',
        'card-lg':
          '0 2px 4px rgba(10, 15, 28, 0.04), 0 12px 32px rgba(10, 15, 28, 0.1)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
