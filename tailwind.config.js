/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-primario': '#0a1f3d',
        'azul-secundario': '#1a3b6d',
        'azul-acento': '#2a5ba8',
        'negro-mate': '#0d0d0d',
      },
      backgroundImage: {
        'degradado-fondo': 'linear-gradient(135deg, var(--tw-colors-negro-mate) 30%, var(--tw-colors-azul-primario) 100%)',
      },
    },
  },
  plugins: [],
};
