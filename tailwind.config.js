/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['Montserrat', 'sans-serif'],
        'heading': ['Montserrat', 'serif'],
        'subheading': ['Cormorant Garamond', 'sans-serif'],
        // 'home': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'custom-shadow': '0 4px 4px rgba(0, 0, 0, 0.25)',
      },
      maxWidth: {
        '8xl': '90rem',  // Add custom width as needed
        '9xl': '100rem', // Another example
        '10xl': '110rem', // Yet another example
      },
      colors: {

        BrigadeOrange1:'#EA5C3D',
        BrigadeOrange2:'#FFF7F5',
        totalgrey:'#f4f4f4',
        PrestigeGrey:'#FBFBFB',
        PrestigeDarkGrey:'#2F2F2F',
        PrestigeBrown:'#856D47'

      },
      opacity: {
        '10': '0.10',
        '22': '0.22',
        '78': '0.78',
        '90': '0.90',
      },
    },
  },
  plugins: [],
}
