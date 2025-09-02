/**@type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme:{
    extend:{
        colors:{
            grisTemplate: '#F2F2F2',
            cremaTemplate: '#E4E4D5',
            tierraTemplate: '#B6B09F',
            negroTemplate: '#000000',
        },
        fontFamily: {
            serifDisplay: ['"DM Serif Display"', 'serif'],
            mono: ['"Roboto Mono"', 'monospace'],
            alegreya: ['"Alegreya Sans"', 'Sans-serif'],
            marriwather: ['"Merriweather"', 'serif'],
        },
    }
  },
  plugins: [],
    
}
