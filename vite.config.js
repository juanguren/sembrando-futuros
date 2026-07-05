import { defineConfig } from "vite";

// Configuración mínima. El sitio es estático: `npm run build` genera /dist
// listo para publicar en Netlify, Vercel o GitHub Pages.
export default defineConfig({
  // Si publicas en GitHub Pages bajo un subpath (usuario.github.io/repo),
  // cambia esto a "/repo/". Para dominio propio o Netlify/Vercel, déjalo en "/".
  base: "/",
});
