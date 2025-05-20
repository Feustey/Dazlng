/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette T4G
        t4g: {
          orange: '#F7931A',
          orangeLight: '#FFD580',
          violet: '#C026D3',
          violetLight: '#E0E7FF',
          yellow: '#facc15',
          dark: '#1a1a1a',
          gray: '#232336',
          grayLight: '#A1A1AA',
        },
        // Palette existante (garde pour compatibilité)
        background: {
          DEFAULT: '#0A0B0D',
          light: '#151719',
        },
        primary: {
          DEFAULT: '#3671E9',
          hover: '#4E85FF',
        },
        secondary: {
          DEFAULT: '#F7931A',
          hover: '#F9A942',
        },
        accent: {
          DEFAULT: '#58ADEC',
          hover: '#72BDFF',
        },
        neutral: {
          100: '#FFFFFF',
          200: '#F2F2F2',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#828282',
          600: '#4F4F4F',
          700: '#333333',
          800: '#1F1F1F',
          900: '#0F0F0F',
        },
        success: {
          DEFAULT: '#00C853',
          dark: '#009624',
        },
        error: {
          DEFAULT: '#FF3B30',
          dark: '#C62828',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'lightning-pattern': "url('/images/lightning-pattern.svg')",
      },
      boxShadow: {
        glow: '0 0 20px rgba(54, 113, 233, 0.3)',
        'lightning-glow': '0 0 30px rgba(255, 215, 0, 0.2)',
        card: '0 4px 20px rgba(0, 0, 0, 0.2)',
        t4g: '0 2px 16px #0002',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        t4g: '1.25rem', // 20px
        t4gFull: '9999px',
      },
    },
  },
  plugins: [],
};

