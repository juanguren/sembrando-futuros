// ─────────────────────────────────────────────────────────────────────────
//  ALIADOS · "Quienes siembran con nosotros" — tono la ronda
// ─────────────────────────────────────────────────────────────────────────

import "./allies.css";
import { esc } from "../../shared/html.js";

// Aliados en tono "la ronda": sellos redondos, como estampados a mano, y un
// sello vacío al final para quien quiera sumarse.
export function renderAliados(aliados, seccion) {
  const sellos = aliados
    .map((a, i) => {
      const dentro = a.logo
        ? `<img src="${esc(a.logo)}" alt="${esc(a.nombre)}" />`
        : `<span>${esc(a.nombre)}</span>`;
      return `<a class="sello sello--${i + 1}" href="${esc(a.url)}" data-entra>${dentro}</a>`;
    })
    .join("");
  const invitacion = seccion.invitacion
    ? `<a class="sello sello--tu" href="${esc(seccion.invitacion.url)}" data-entra>${esc(seccion.invitacion.texto)}</a>`
    : "";
  return `
    <section class="seccion seccion--alt ronda" id="aliados">
      <p class="eyebrow">${esc(seccion.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(seccion.titulo)}</h2>
      <div class="sellos">${sellos}${invitacion}</div>
    </section>`;
}
