/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b'
        },
        dark: {
          bg: '#0b0f19',
          card: 'rgba(18, 24, 38, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#10b981'
        }
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        xl: '24px'
      }
    },
  },
  plugins: [],
}
