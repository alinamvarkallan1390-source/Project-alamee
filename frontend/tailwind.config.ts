import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0A0A0B',
        coal: '#121214',
        champagne: '#C9A96A',
        champagneLight: '#E8D5A8',
        ivory: '#F5F1E8'
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
export default config;
