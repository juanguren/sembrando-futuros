// ─────────────────────────────────────────────────────────────────────────
//  NAV · barra fija y menú móvil
//
//  El menú se abre y se cierra solo con CSS (checkbox); shared/interactions.js
//  mantiene los aria al día.
// ─────────────────────────────────────────────────────────────────────────

import "./nav.css";
import { esc } from "../../shared/html.js";

export function renderNav(sitio) {
  const enlaces = sitio.nav
    .map((l) => `<li><a href="${esc(l.ancla)}">${esc(l.texto)}</a></li>`)
    .join("");
  return `
    <nav class="nav" aria-label="Navegación principal">
      <a class="nav__logo" href="/#inicio">${esc(sitio.nombre)}</a>
      <input type="checkbox" id="nav-toggle" class="nav__toggle" />
      <label for="nav-toggle" class="nav__burger" aria-label="Abrir menú"
             aria-controls="nav-menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </label>
      <!-- velo: otro label del mismo checkbox; tocar fuera del menú lo cierra -->
      <label for="nav-toggle" class="nav__velo" aria-hidden="true"></label>
      <ul class="nav__links" id="nav-menu">${enlaces}</ul>
    </nav>`;
}
