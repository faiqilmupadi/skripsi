import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        border: '#E2E8F0',
        bgsoft: '#F8FAFC'
      }
    }
  },
  plugins: []
} satisfies Config;
