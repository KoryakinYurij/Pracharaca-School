/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        'gold-dark': 'rgb(var(--color-gold-dark) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 14px 34px -24px rgba(38, 38, 38, 0.35)',
        card: '0 20px 45px -36px rgba(34, 34, 34, 0.4)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
