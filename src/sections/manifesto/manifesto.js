// ─────────────────────────────────────────────────────────────────────────
//  MANIFIESTO · "¿Por qué lo hacemos?" — tono fogata
//
//  La brasa y las chispas las anima bonfire.js.
// ─────────────────────────────────────────────────────────────────────────

import "./manifesto.css";
import { esc, texto } from "../../shared/html.js";

// El manifiesto en tono "fogata": anochece, se enciende una brasa bajo la
// pregunta y en la pared las sombras de las plantas tiemblan con la luz.
// Los tres beats van en una sola columna bajo el fuego, sin cajas (las
// notas y los pasos ya son tarjetas; aquí no se repite la figura).
// bonfire.js enciende la brasa al llegar y hace subir las chispas.
export function renderFilosofia(f) {
  const beats = f.beats
    .map(
      (b) => `
      <div class="beat" data-entra>
        <b class="beat__titulo">${esc(b.titulo)}</b>
        <span class="beat__texto">${texto(b.texto)}</span>
      </div>`
    )
    .join("");
  return `
    <section class="seccion filosofia fogata" id="filosofia">
      <div class="fogata__pared" aria-hidden="true">
        <span class="sombra sombra--1"></span>
        <span class="sombra sombra--2"></span>
        <span class="sombra sombra--3"></span>
      </div>
      <div class="fogata__contenido">
        ${f.eyebrow ? `<p class="eyebrow">${esc(f.eyebrow)}</p>` : ""}
        <div class="fogata__hogar">
          <span class="fogata__brasa" aria-hidden="true"><span class="fogata__luz"></span></span>
          <span class="fogata__chispas" aria-hidden="true"></span>
          <blockquote class="filosofia__cita">${esc(f.cita)}</blockquote>
        </div>
        <div class="filosofia__beats">${beats}</div>
        <button class="btn btn--acento" data-modal="manifiesto-completo">
          ${esc(f.ctaCompleto)}
        </button>
      </div>
      ${renderModalManifiesto(f)}
    </section>`;
}

// El manifiesto completo, para quien quiera ahondar (modal <dialog>).
function renderModalManifiesto(f) {
  const parrafos = f.completo.map((p) => `<p>${esc(p)}</p>`).join("");
  return `
    <dialog class="modal" id="manifiesto-completo" aria-labelledby="manifiesto-tit">
      <div class="modal__caja modal__caja--texto">
        <button class="modal__cerrar" data-close aria-label="Cerrar">&times;</button>
        <p class="modal__eyebrow">manifiesto</p>
        <h3 class="modal__titulo" id="manifiesto-tit">${esc(f.manifiestoTitulo)}</h3>
        <div class="manifiesto-largo">${parrafos}</div>
      </div>
    </dialog>`;
}
