# sembrando futuros · v1

Landing informativa para quien escanea el QR del sobre de semillas.
Sitio estático, vanilla (HTML/CSS/JS) sobre Vite.

## Estructura

```
sembrando-futuros/
├─ index.html          cáscara mínima (carga tipografías y monta la app)
├─ src/
│  ├─ content.js       👈 TODO el contenido vive aquí. Edita esto.
│  ├─ render.js        el marcado (no contiene texto del sitio)
│  ├─ main.js          punto de entrada: une contenido + marcado
│  └─ style.css        toda la estética; los colores son variables en :root
└─ public/
   ├─ favicon.svg
   └─ logos/           pon aquí los logos reales de los aliados
```

La regla de oro: **el contenido (`content.js`) está separado del marcado
(`render.js`) y de los estilos (`style.css`).** Para cambiar un texto, una
semilla o un link, solo tocas `content.js`.

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
pasos, aliados) se vuelve una *content collection* de Astro, cada función de
`render.js` se vuelve un componente `.astro`, y el mapa entra como una "isla"
sin tocar el resto. La separación de hoy es justo para que ese salto sea barato.
