/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cute-green': '#4CAF50',
        'fun-orange': '#FF9800',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        fredoka: ['Fredoka', 'cursive'],
      },
    },
  },
  plugins: [],
}