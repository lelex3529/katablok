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
        'katalyx-primary': '#FF5A36', // Brighter orange
        'katalyx-primary-light': '#FF8A70', // Lighter orange for hover/accents
        'katalyx-secondary': '#4361EE', // Vibrant blue for complementary colors
        'katalyx-secondary-light': '#6B89FF', // Light blue for accents
        'katalyx-tertiary': '#7209B7', // Purple for highlights
        'katalyx-success': '#06D6A0', // Bright teal for success states
        'katalyx-warning': '#FFD166', // Bright yellow for warnings
        'katalyx-error': '#EF476F', // Bright pink-red for errors
        'katalyx-dark': '#1B1B1E',
        'katalyx-neutral-gray': '#525252',
        'katalyx-off-white': '#F9F9FF', // Slightly cooler white
        'katalyx-text': '#2C2C2C',
        primary: '#FF5A36', // Match katalyx-primary
        'primary-dark': '#E13E1A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 6px -1px rgba(255, 90, 54, 0.2), 0 2px 4px -2px rgba(255, 90, 54, 0.1)',
        'button-hover': '0 10px 15px -3px rgba(255, 90, 54, 0.3), 0 4px 6px -4px rgba(255, 90, 54, 0.2)',
        'secondary-button': '0 4px 6px -1px rgba(67, 97, 238, 0.2), 0 2px 4px -2px rgba(67, 97, 238, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF5A36 0%, #FF8A70 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4361EE 0%, #6B89FF 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #7209B7 0%, #9D4EDD 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 249, 255, 0.8) 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
        'xl': '4px',
        '2xl': '6px',
      },
    },
  },
};
export default config;
