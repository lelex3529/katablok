import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'katalyx-primary': '#E85431',
        'katalyx-dark': '#1B1B1E',
        'katalyx-neutral-gray': '#525252',
        'katalyx-off-white': '#F5F5F5',
        'katalyx-text': '#2C2C2C', // Assuming a dark gray for text
        primary: '#E85431',
        'primary-dark': '#D13E1C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Using Inter as Avenir Next might not be available
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
