/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        grenrose: {
          50: '#fef8f6',
          100: '#fde8e0',
          200: '#fbd6c8',
          300: '#f8b9a3',
          400: '#f49270',
          500: '#e97d57',
          600: '#d25f3f',
          700: '#b54934',
          800: '#963c2e',
          900: '#7d342a',
        },
      },
    },
  },
  plugins: [],
}
