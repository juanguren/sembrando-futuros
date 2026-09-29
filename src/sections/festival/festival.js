// ─────────────────────────────────────────────────────────────────────────
//  FESTIVAL · "¿Qué es Sembrando Futuros?" — tono cartelera de barrio
// ─────────────────────────────────────────────────────────────────────────

import "./festival.css";
import { esc, texto } from "../../shared/html.js";

// Banda del evento en tono "cartelera de barrio": las tres tarjetas son notas
// pegadas al tablón (giradas, escalonadas) y un blob lima asoma por un lado.
export function renderEvento(evento) {
  const notas = evento.tarjetas
    .map(
      (t, i) => `
      <div class="nota nota--${i + 1}" data-entra>
        <p class="nota__k">${esc(t.k)}</p>
        <h3 class="nota__titulo">${esc(t.titulo)}</h3>
        <p class="nota__texto">${texto(t.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion seccion--alt cartelera" id="evento">
      <div class="blob blob--a" aria-hidden="true"></div>
      ${evento.eyebrow ? `<p class="eyebrow">${esc(evento.eyebrow)}</p>` : ""}
      <h2 class="seccion__titulo">${esc(evento.titulo)}</h2>
      <p class="seccion__intro">${texto(evento.intro)}</p>
      <div class="notas">${notas}</div>
    </section>`;
}
