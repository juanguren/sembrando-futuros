# sembrando futuros · v1

Landing informativa para quien escanea el QR del sobre de semillas.
Sitio estático, vanilla (HTML/CSS/JS) sobre Vite.

## Estructura

```
sembrando-futuros/
├─ index.html · custodios.html   cáscaras mínimas (tipografías + SEO); cada una carga su página
├─ src/
│  ├─ content.js    👈 TODO el contenido vive aquí. Edita esto.
│  ├─ pages/        una entrada por página: qué secciones van y en qué orden
│  ├─ sections/     una carpeta por sección, con su marcado (.js) y su estilo (.css)
│  │   nav · hero · festival · seeds · steps · manifesto · allies · join · custodians
│  ├─ shared/       lo que usan varias secciones: html, azar, modales, revelado, lightbox
│  ├─ styles/       estilos globales: tokens, base, temas y piezas comunes
│  └─ tools/        herramientas temporales (el selector de temas, oculto: aparece con ?temas)
└─ public/
   ├─ favicon.svg
   └─ semillas/     fotos de las semillas
```

La regla de oro: **el contenido (`content.js`) está separado del marcado y de
los estilos.** Para cambiar un texto, una semilla o un link, solo tocas
`content.js`. Para cambiar cómo se ve una sección, todo está en su carpeta de
`src/sections/`.

Agregar una sección: copia una carpeta de `src/sections/`, renómbrala e
impórtala en su página (`src/pages/`). Quitarla: borra la carpeta y su línea.

## Correr en local

```bash
npm install
npm run dev      # abre http://localhost:5173
```

## Publicar

```bash
npm run build    # genera /dist
```

Sube el repo a GitHub y conéctalo a **Netlify** o **Vercel** (build:
`npm run build`, carpeta: `dist`). Cada push despliega solo.

## Antes de publicar

- [ ] Validar especies e instrucciones de siembra con el banco de semillas
      (los datos en `content.js` son placeholders razonables).
- [ ] Reemplazar los logos y URLs de aliados en `content.js` / `public/logos/`.
- [ ] Poner los links reales de Instagram / WhatsApp.

## El salto a Astro (v2, el mapa)

Cuando llegue el mapa colaborativo: cada arreglo de `content.js` (semillas,
pasos, aliados) se vuelve una *content collection* de Astro, cada carpeta de
`src/sections/` se vuelve un componente `.astro`, y el mapa entra como una "isla"
sin tocar el resto. La separación de hoy es justo para que ese salto sea barato.
