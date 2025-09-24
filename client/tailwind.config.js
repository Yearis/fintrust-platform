/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add this 'colors' block
      colors: {
        'fintrust-green': '#1FB8CD', // The main teal color from your design
        'fintrust-dark': '#134252',  // A darker color for text
      },
    },
  },
  plugins: [],
}