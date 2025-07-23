/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        'dark-200': 'var(--color-dark-200)',
        'light-blue-100': 'var(--color-light-blue-100)',
        'light-blue-200': 'var(--color-light-blue-200)',
        'badge-green': 'var(--color-badge-green)',
        'badge-red': 'var(--color-badge-red)',
        'badge-yellow': 'var(--color-badge-yellow)',
        'badge-green-text': 'var(--color-badge-green-text)',
        'badge-red-text': 'var(--color-badge-red-text)',
        'badge-yellow-text': 'var(--color-badge-yellow-text)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}