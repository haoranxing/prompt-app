/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b0d14',
          card: '#15192b',
          'card-2': '#1c2138',
          border: '#2a304a'
        },
        accent: {
          pink: '#ff4d8d',
          blue: '#4d8dff',
          green: '#2ecc71',
          purple: '#8b5cf6',
          cyan: '#22d3ee'
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', 'sans-serif']
      }
    }
  },
  plugins: []
};
