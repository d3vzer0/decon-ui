/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./stories/*.{js,ts,jsx,tsx,mdx,vue}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['business']
  }
}

