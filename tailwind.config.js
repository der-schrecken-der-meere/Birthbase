/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    "./index.html",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      "sans": ["Inter", "sans-serif"]
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        "dark_grey_10": "rgba(53, 55, 65, 1)",
        "dark_grey_07": "rgba(53, 55, 65, 0.7)",
        "dark_grey_05": "rgba(53, 55, 65, 0.5)",
        "light_grey_10": "rgba(73, 75, 88, 1)",
        "light_grey_07": "rgba(73, 75, 88, 0.7)",
        "light_grey_05": "rgba(73, 75, 88, 0.5)",
        "white_10": "rgba(239, 239, 239, 1)",
        "white_07": "rgba(239, 239, 239, 0.7)",
        "white_05": "rgba(239, 239, 239, 0.5)",
        "highlight_10": "rgba(0, 255, 132, 1)",
        "highlight_07": "rgba(0, 255, 132, 0.7)",
        "highlight_05": "rgba(0, 255, 132, 0.5)",
        "caution": "rgba(255, 106, 106, 1)",


        
        "main-bg": "rgb(var(--bg))",
        "main-text": "rgb(var(--text))",

        "nav-border": "rgb(var(--nav-border))",
        "nav-bg": "rgb(var(--nav-bg))",
        "nav-page": "rgb(var(--nav-page))",
        "nav-icons": "rgb(var(--nav-icons))",
        "nav-icons-hover": "rgb(var(--nav-icons-hover))",
        "nav-icons-active": "rgb(var(--nav-icons-active))",

        "content-header-border": "rgb(var(--content-header-border))",

        "switch-bg": "rgb(var(--switch-bg))",
        "switch-text": "rgb(var(--switch-text))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      padding: {
        "10/60": "0.625rem 3.75rem",
        "20/30": "1.25rem 1.875rem"
      },
      spacing: {
        "04": "0.04rem"
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
        rippleScale: {
          "0%": {transform: "scale(0)", opacity: "0"},
          "100%": {transform: "scale(4)", opacity: "0.3"}
        },
        rippleFade: {
          "100%": {opacity: "0"}
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}