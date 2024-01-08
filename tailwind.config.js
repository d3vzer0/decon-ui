/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    // themes: ["light"]
    // themes: true,
    darkTheme: 'business',
    themes: ['light', 'business', 'corporate', 'cupcake']
  }
}
