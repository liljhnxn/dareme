/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0d",
          900: "#0f1117",
          850: "#14161f",
          800: "#1a1d27",
          700: "#242836",
          600: "#32374a",
        },
        dare: {
          purple: {
            DEFAULT: "#8b5cf6",
            light: "#a78bfa",
            dark: "#6d28d9",
            faint: "rgba(139, 92, 246, 0.08)",
          },
          green: {
            DEFAULT: "#10b981",
            light: "#34d399",
            dark: "#059669",
            faint: "rgba(16, 185, 129, 0.1)",
          },
        },
      },
    },
  },
  plugins: [],
};

