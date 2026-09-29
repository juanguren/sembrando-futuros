// ─────────────────────────────────────────────────────────────────────────
//  ÚNETE · "Somos parte de algo más grande" + el formulario
//
//  Tono vuelta a la verbena; cierra las dos páginas. El envío del
//  formulario lo maneja signup.js.
// ─────────────────────────────────────────────────────────────────────────

import "./join.css";
import { esc, texto, marcar } from "../../shared/html.js";

// Piezas del confeti del hero que vuelven en la banda final (forma, tono).
// Sus posiciones y vuelo viven en join.css (.vuelta__confeti).
const CONFETI_VUELTA = [
  ["semilla", "tinta"], ["hoja", "crema"], ["punto", "tinta"], ["brote", "crema"],
  ["semilla", "crema"], ["punto", "arcilla"], ["hoja", "tinta"], ["brote", "tinta"],
];

// Banda final en tono "vuelta a la verbena": el mismo cierre en fiesta que
// /custodios (fondo acento, blobs, título girado), el formulario como un
// recorte de papel pegado con cinta y unas piezas del confeti del hero: el
// ciclo se cierra donde empezó. El envío del form lo engancha signup.js;
// incluye honeypot y consentimiento.
export function renderColectivoSumate(c, r) {
  const aviso = r.avisoPrivacidad
    ? ` <a href="${esc(r.avisoPrivacidad.url)}">${esc(r.avisoPrivacidad.texto)}</a>.`
    : "";
  const confeti = CONFETI_VUELTA
    .map(([forma, tono]) => `<span class="confeti confeti--${forma} confeti--${tono}"></span>`)
    .join("");
  return `
    <section class="seccion verbena vuelta" id="sumate">
      <div class="verbena__blob1" aria-hidden="true"></div>
      <div class="verbena__blob2" aria-hidden="true"></div>
      <div class="vuelta__confeti" aria-hidden="true">${confeti}</div>
      <div class="verbena__contenido vuelta__grid">
        <div class="vuelta__voz">
          ${c.eyebrow ? `<p class="eyebrow">${esc(c.eyebrow)}</p>` : ""}
          <h2 class="verbena__titulo">${marcar(c.titulo)}</h2>
          <p class="verbena__texto">${texto(c.texto)}</p>
          <p class="vuelta__teaser">${esc(c.teaser)}</p>
        </div>
        <div class="vuelta__registro cinta" data-entra>
          <h3 class="vuelta__sub">${esc(r.titulo)}</h3>
          <p class="vuelta__intro">${texto(r.intro)}</p>
          <form class="registro__form" novalidate>
            <!-- honeypot: invisible para humanos; si un bot lo llena, se descarta -->
            <div class="registro__trampa" aria-hidden="true">
              <label>No llenes esto
                <input type="text" name="website" tabindex="-1" autocomplete="off" />
              </label>
            </div>
            <div class="registro__campos">
              <label class="campo">
                <span class="campo__label">${esc(r.campos.nombre)}</span>
                <input class="campo__input" type="text" name="nombre" required
                       autocomplete="name" />
              </label>
              <label class="campo">
                <span class="campo__label">${esc(r.campos.email)}</span>
                <input class="campo__input" type="email" name="email" required
                       autocomplete="email" />
              </label>
              <label class="campo">
                <span class="campo__label">${esc(r.campos.barrio)}</span>
                <input class="campo__input" type="text" name="barrio"
                       autocomplete="address-level3" />
              </label>
            </div>
            <label class="registro__consent">
              <input type="checkbox" name="consentimiento" required />
              <span>${esc(r.consentimiento)}${aviso}</span>
            </label>
            <button class="btn btn--acento" type="submit">${esc(r.boton)}</button>
            <p class="registro__estado" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>`;
}
