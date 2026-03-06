/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'store': 'var(--store-bg)',
        'store-accent': 'var(--store-accent)',
        'admin-border': 'var(--admin-border)',
        'admin-bg': 'var(--admin-bg)',
        'admin-page': 'var(--admin-page-bg)',
      },
      borderColor: { 'admin': 'var(--admin-border)' },
      divideColor: { 'admin': 'var(--admin-border)' },
    },
  },
  plugins: [],
}