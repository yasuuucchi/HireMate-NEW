import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      primary: {
        DEFAULT: '#1F4532',
        light: '#2A5A42',
      },
      accent: {
        DEFAULT: '#6CCF4F',
        light: '#7FD964',
      },
      secondary: {
        DEFAULT: '#F4D35E',
        light: '#F7DD7E',
      },
      red: {
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
      boxShadow: {
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
