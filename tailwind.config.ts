/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🇹🇬 Couleurs officielles du Togo
        togo: {
          green: '#009933',
          yellow: '#FFD700',
          red: '#DC143C',
          white: '#FFFFFF',
          bg: '#f8fafc',
          dark: '#1e293b',
          gray: '#64748b',
        }
      },
    },
  },
  plugins: [],
}