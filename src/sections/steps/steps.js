// ─────────────────────────────────────────────────────────────────────────
//  PASOS · "¿Y ahora qué hago?" — tono brote
// ─────────────────────────────────────────────────────────────────────────

import "./steps.css";
import { esc, texto } from "../../shared/html.js";

// Banda "¿y ahora qué?" en tono "brote": los tres pasos crecen de izquierda
// a derecha y el número deja de ser un círculo: semilla → brote → hoja.
export function renderQueHago(queHago) {
  const pasos = queHago.pasos
    .map(
      (p, i) => `
      <div class="paso paso--${i + 1}" data-entra>
        <h3 class="paso__titulo">${esc(p.titulo)}</h3>
        <p class="paso__texto">${texto(p.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion brote" id="pasos">
      ${queHago.eyebrow ? `<p class="eyebrow">${esc(queHago.eyebrow)}</p>` : ""}
      <h2 class="seccion__titulo">${esc(queHago.titulo)}</h2>
      <div class="pasos">${pasos}</div>
    </section>`;
}
