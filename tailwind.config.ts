import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        }
      },
      fontSize: {
        'senior-sm':   ['16px', { lineHeight: '1.6' }],
        'senior-base': ['18px', { lineHeight: '1.6' }],
        'senior-lg':   ['20px', { lineHeight: '1.5' }],
        'senior-xl':   ['22px', { lineHeight: '1.4' }],
        'senior-2xl':  ['26px', { lineHeight: '1.3' }],
        'senior-3xl':  ['32px', { lineHeight: '1.2' }],
      },
      spacing: {
        'tap': '56px',
        'tap-lg': '64px',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}

export default config
