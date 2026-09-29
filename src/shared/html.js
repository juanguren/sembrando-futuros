// ─────────────────────────────────────────────────────────────────────────
//  HTML · de contenido a marcado, con cuidado
//
//  Todo texto del contenido pasa por aquí antes de llegar a la página: las
//  funciones de sections/ arman su HTML con estas tres.
// ─────────────────────────────────────────────────────────────────────────

// Escapa para texto Y para atributos: incluye comillas, porque muchos valores
// se interpolan dentro de atributos (href, data-*, id). Correcto por defecto,
// también cuando el contenido venga de un CMS.
export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Texto de contenido: escapa y respeta los saltos de línea (una línea nueva
// en content.js es un <br> en la página). Para párrafos, notas, pasos.
export const texto = (s) => esc(s).replace(/\n/g, "<br />");

// Convierte [[palabra]] en <mark>palabra</mark> (resaltado de marcador),
// escapando todo lo demás; el resaltado puede abarcar varias líneas. Se usa
// en títulos/textos del contenido.
export const marcar = (s) =>
  esc(s).replace(/\[\[([\s\S]+?)\]\]/g, "<mark>$1</mark>").replace(/\n/g, "<br />");
