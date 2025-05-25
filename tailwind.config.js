/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 4s infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-delayed': 'fadeIn 1s ease-out 0.5s forwards',
        'fade-in-delayed-2': 'fadeIn 1s ease-out 1s forwards',
        'fade-in-delayed-3': 'fadeIn 1s ease-out 1.5s forwards',
        'fade-in-down': 'fadeInDown 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
        fadeIn: {
          from: { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          from: { 
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(100%)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
