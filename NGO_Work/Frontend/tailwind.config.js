/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary-fixed-dim": "#e8c400",
        "on-primary-fixed-variant": "#36456f",
        background: "#f9f9f9",
        "on-primary": "#ffffff",
        "accent-magenta": "#9B216B",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "surface-variant": "#e2e2e2",
        "tertiary-container": "#410004",
        muted: "#64748B",
        "text-muted": "#64748B",
        "on-tertiary-fixed-variant": "#930014",
        "on-error-container": "#93000a",
        surface: "#f9f9f9",
        "surface-container-high": "#e8e8e8",
        secondary: "#ed8901",
        "surface-dim": "#dadada",
        "on-surface-variant": "#45464e",
        "secondary-fixed": "#ffe16a",
        primary: "#00123a",
        "inverse-on-surface": "#f0f1f1",
        "surface-tint": "#4e5d88",
        "surface-container-low": "#f3f3f4",
        "text-main": "#1A1A1A",
        "secondary-container": "#fed813",
        "surface-container-highest": "#e2e2e2",
        "on-secondary-fixed": "#221b00",
        tertiary: "#000000",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#b6c5f6",
        "on-secondary-container": "#705e00",
        "surface-muted": "#F8F9FA",
        "on-background": "#1a1c1c",
        "primary-fixed-dim": "#b6c5f6",
        "on-primary-fixed": "#061941",
        "on-tertiary-container": "#f04344",
        error: "#ba1a1a",
        "tertiary-fixed-dim": "#ffb3ae",
        "primary-container": "#061941",
        "tertiary-fixed": "#ffdad7",
        "primary-fixed": "#dae2ff",
        "outline-variant": "#c5c6cf",
        outline: "#75777f",
        "inverse-surface": "#2f3131",
        "on-primary-container": "#7383b0",
        "error-container": "#ffdad6",
        "surface-bright": "#f9f9f9",
        "on-surface": "#1a1c1c",
        "on-tertiary-fixed": "#410004",
        "on-secondary": "#ffffff",
        "on-secondary-fixed-variant": "#544600",
        "surface-container": "#eeeeee"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        lg: "48px",
        base: "8px",
        xs: "4px",
        sm: "12px",
        "container-max": "1280px",
        xl: "80px",
        md: "24px",
        gutter: "24px"
      },
      fontFamily: {
        "label-md": ["Plus Jakarta Sans"],
        "headline-lg-mobile": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "body-lg": ["Plus Jakarta Sans"],
        "label-sm": ["Plus Jakarta Sans"],
        "headline-lg": ["Plus Jakarta Sans"],
        "headline-xl": ["Plus Jakarta Sans"]
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }]
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'page-enter': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'page-enter': 'page-enter 0.5s ease-out forwards'
      }
    }
  },
  plugins: [],
}
