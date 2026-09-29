// ─────────────────────────────────────────────────────────────────────────
//  HERO · la primera pantalla
//
//  Título con palabra rotativa, hashtags, párrafo, botones y el marco de la
//  foto del paquete. El confeti y la palabra que cambia los anima
//  hero-motion.js.
// ─────────────────────────────────────────────────────────────────────────

import "./hero.css";
import { esc, texto } from "../../shared/html.js";

// Columna de media del hero (foto o gif del paquete con el QR).
function renderHeroMedia(media) {
  if (!media) return "";
  const cuerpo = media.src
    ? `<img src="${esc(media.src)}" alt="${esc(media.alt)}" />`
    : `<span class="hero__media-ph">${esc(media.nota)}</span>`;
  return `
    <div class="hero__media${media.src ? "" : " hero__media--ph"}">
      <div class="hero__media-marco">${cuerpo}</div>
    </div>`;
}

export function renderHero(hero) {
  return `
    <header class="hero" id="inicio">
      <div class="hero__texto">
        ${hero.eyebrow ? `<p class="eyebrow">${esc(hero.eyebrow)}</p>` : ""}
        <h1 class="hero__titulo">${esc(hero.tituloAntes)} <span class="hero__rota" data-rota><span class="hero__rota-cap">${esc(hero.tituloRota[0])}</span></span> ${esc(hero.tituloDespues)}</h1>
        ${
          hero.hashtags?.length
            ? `<p class="hero__hashtags">${hero.hashtags
                .map((h) => `<span>${esc(h)}</span>`)
                .join("")}</p>`
            : ""
        }
        <p class="hero__parrafo">${texto(hero.parrafo)}</p>
        <div class="hero__ctas">
          <a class="btn btn--acento" href="${esc(hero.ctaPrincipal.ancla)}">
            ${esc(hero.ctaPrincipal.texto)}
          </a>
          <a class="btn btn--fantasma" href="${esc(hero.ctaSecundario.ancla)}">
            ${esc(hero.ctaSecundario.texto)}
          </a>
        </div>
      </div>
      ${renderHeroMedia(hero.media)}
    </header>`;
}
