import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        blue: {
          50: "rgba(237, 239, 255, 1)",
          100: "rgba(222, 226, 255, 1)",
          200: "rgba(196, 201, 255, 1)",
          300: "rgba(160, 166, 255, 1)",
          400: "rgba(126, 123, 255, 1)",
          500: "rgba(106, 91, 249, 1)",
          600: "rgba(91, 61, 238, 1)",
          700: "rgba(79, 47, 211, 1)",
          800: "rgba(64, 41, 170, 1)",
          900: "rgba(55, 41, 134, 1)",
        },
        green: {
          50: "rgba(239, 250, 243, 1)",
          100: "rgba(217, 242, 225, 1)",
          200: "rgba(181, 229, 199, 1)",
          300: "rgba(133, 208, 165, 1)",
          400: "rgba(82, 181, 128, 1)",
          500: "rgba(54, 174, 114, 1)",
          600: "rgba(32, 123, 80, 1)",
          700: "rgba(26, 98, 66, 1)",
          800: "rgba(23, 78, 54, 1)",
          900: "rgba(19, 65, 45, 1)",
        },
        orange: {
          50: "rgba(255, 248, 237, 1)",
          100: "rgba(255, 239, 212, 1)",
          200: "rgba(255, 219, 168, 1)",
          300: "rgba(255, 193, 112, 1)",
          400: "rgba(255, 155, 55, 1)",
          500: "rgba(255, 137, 36, 1)",
          600: "rgba(240, 98, 6, 1)",
          700: "rgba(199, 73, 7, 1)",
          800: "rgba(158, 57, 14, 1)",
          900: "rgba(127, 50, 15, 1)",
        },
        red: {
          50: "rgba(254, 242, 242, 1)",
          100: "rgba(254, 226, 226, 1)",
          200: "rgba(254, 202, 202, 1)",
          300: "rgba(252, 165, 165, 1)",
          400: "rgba(248, 113, 113, 1)",
          500: "rgba(239, 68, 68, 1)",
          600: "rgba(220, 38, 38, 1)",
          700: "rgba(185, 28, 28, 1)",
          800: "rgba(153, 27, 27, 1)",
          900: "rgba(127, 29, 29, 1)",
        },
        gris: {
          50: "rgba(245, 245, 246, 1)",
          100: "rgba(229, 230, 232, 1)",
          200: "rgba(206, 207, 211, 1)",
          300: "rgba(172, 175, 180, 1)",
          400: "rgba(131, 134, 141, 1)",
          500: "rgba(97, 100, 107, 1)",
          600: "rgba(89, 92, 97, 1)",
          700: "rgba(76, 78, 82, 1)",
          800: "rgba(67, 68, 71, 1)",
          900: "rgba(38, 38, 38, 1)",
        },
        dark: "rgba(0, 0, 0, 1)",
        white: "rgba(255, 255, 255, 1)",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica"],
        squada: ["Squada One", "Helvetica"],
      },
      fontSize: {
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-bold": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "body-small": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-small-bold": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "body-small2": ["12px", { lineHeight: "18px", fontWeight: "700" }],
        "body-testimonials": [
          "20px",
          { lineHeight: "30px", fontWeight: "400" },
        ],
        "body-testimonials-bold": [
          "20px",
          { lineHeight: "30px", fontWeight: "700" },
        ],
        button: [
          "18px",
          { lineHeight: "28px", fontWeight: "400", letterSpacing: "0.5px" },
        ],
        "label-input": ["14px", { fontWeight: "700" }],
        "link-desktop": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        h1: ["48px", { lineHeight: "60px", fontWeight: "400" }],
        h2: ["32px", { lineHeight: "40px", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "32px", fontWeight: "400" }],
        h4: ["20px", { lineHeight: "28px", fontWeight: "400" }],
        h5: ["18px", { lineHeight: "24px", fontWeight: "400" }],
        h6: ["16px", { lineHeight: "20px", fontWeight: "400" }],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
      boxShadow: {
        "card-dashboard": "1px 1px 4px 0px rgba(0, 0, 0, 0.15)",
        "card-profil": "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        "cardwhite-dashboard": "1px 1px 2px 0px rgba(0, 0, 0, 0.1)",
        menu: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
