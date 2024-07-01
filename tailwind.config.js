/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "echart-700": 'rgba(136,154,255,0.65)',
        "echart-600": 'rgba(255,174,0,0.65)',
        "echart-500": 'rgba(93,203,252,0.65)',
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
