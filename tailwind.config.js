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
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-delayed': 'fadeIn 0.8s ease-out 0.3s forwards',
        'fade-in-delayed-2': 'fadeIn 0.8s ease-out 0.6s forwards',
        'fade-in-delayed-3': 'fadeIn 0.8s ease-out 0.9s forwards',
        'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'zoom-in': 'zoomIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1) translateZ(0)' },
          '50%': { transform: 'translateY(-20px) scale(1.1) translateZ(0)' },
        },
        fadeIn: {
          from: { 
            opacity: '0',
            transform: 'translateY(20px) translateZ(0)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0) translateZ(0)',
          },
        },
        fadeInDown: {
          from: { 
            opacity: '0',
            transform: 'translateY(-10px) translateZ(0)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0) translateZ(0)',
          },
        },
        slideUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(100%) translateZ(0)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0) translateZ(0)',
          },
        },
        zoomIn: {
          from: { 
            opacity: '0',
            transform: 'scale(0.9) translateZ(0)',
          },
          to: { 
            opacity: '1',
            transform: 'scale(1) translateZ(0)',
          },
        },
      },
      maxWidth: {
        '7xl': '80rem',
        '8xl': '88rem',
        '9xl': '96rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
  safelist: [
    // Couleurs principales dynamiques
    {
      pattern: /^(bg|text|border|from|to|hover:bg|hover:text)-(indigo|blue|purple|yellow|orange|green|red|gray|emerald|pink|black|white)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Opacités fractionnaires
    {
      pattern: /^(bg|text|border)-(white|black|yellow|green|blue|purple|orange|red|gray)\/(5|10|20|30|40|50|60|70|80|90|100)$/,
    },
    // Gradients et directions
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    // Animations utilitaires
    'animate-pulse',
    'animate-float',
    'animate-fade-in',
    'animate-fade-in-delayed',
    'animate-fade-in-delayed-2',
    'animate-fade-in-delayed-3',
    'animate-fade-in-down',
    'animate-slide-up',
    'animate-zoom-in',
    // Arrondis
    'rounded-full',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-bl-xl',
    'rounded-tr-3xl',
    // Divers
    'bg-white',
    'bg-black',
    'text-white',
    'text-black',
    'border-white',
    'border-black',
  ],
}
