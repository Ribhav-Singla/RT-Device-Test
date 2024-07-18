const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
    colors:{
      'floralWhite' : '#ffece2',
      'timerWolf' : '#CCC5B9',
      'blackOlive' : '#403D39',
      'eerieBlack' : '#252422',
      'flame' : '#EB5E28'
    }
  },
  plugins: [flowbite.plugin(),],
}

