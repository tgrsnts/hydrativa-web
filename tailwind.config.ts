import type { Config } from "tailwindcss";
import daisyui from 'daisyui';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'], // Add fallback font
      },
      colors: {
        background: '#0A3E0A',
        primary: '#1A5319',
        second: '#508D4E',
        additional1: '#80AF81',
        additional2: '#D6EFD8',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [daisyui],
};
export default config;
