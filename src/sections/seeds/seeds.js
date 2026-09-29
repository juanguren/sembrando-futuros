// ─────────────────────────────────────────────────────────────────────────
//  SEMILLAS · fichas de herbario, guía de cada semilla y puente a custodios
//
//  Tono mesa de herbario: las fichas quietas y precisas; el calor, alrededor.
// ─────────────────────────────────────────────────────────────────────────

import "./seeds.css";
import { esc, texto, marcar } from "../../shared/html.js";

// Una foto de la ficha. Si hay "src", es un botón que abre el lightbox.
function renderFoto(foto, etiqueta, pendiente) {
  if (foto.src) {
    return `
      <figure class="foto">
        <button class="foto__marco foto__btn" data-full="${esc(foto.src)}"
                data-alt="${esc(foto.alt)}" aria-label="Ampliar: ${esc(foto.alt)}">
          <img src="${esc(foto.src)}" alt="${esc(foto.alt)}" loading="lazy" />
        </button>
        <figcaption class="foto__pie">${esc(etiqueta)}</figcaption>
      </figure>`;
  }
  return `
    <figure class="foto foto--ph">
      <div class="foto__marco"><span class="foto__pendiente">${esc(pendiente)}</span></div>
      <figcaption class="foto__pie">${esc(etiqueta)}</figcaption>
    </figure>`;
}

function renderListaGuia(titulo, items, ordenada) {
  const etiqueta = ordenada ? "ol" : "ul";
  const lis = items.map((t) => `<li>${esc(t)}</li>`).join("");
  return `
    <div class="guia__bloque">
      <h4 class="guia__sub">${esc(titulo)}</h4>
      <${etiqueta} class="guia__lista guia__lista--${ordenada ? "pasos" : "cuidados"}">${lis}</${etiqueta}>
    </div>`;
}

// El modal con los pasos y cuidados de una semilla.
function renderModalGuia(s, etiquetas) {
  return `
    <dialog class="modal" id="guia-${esc(s.id)}" aria-labelledby="guia-${esc(s.id)}-tit">
      <div class="modal__caja">
        <button class="modal__cerrar" data-close aria-label="Cerrar">&times;</button>
        <p class="modal__eyebrow">${esc(etiquetas.guiaEyebrow)}</p>
        <h3 class="modal__titulo" id="guia-${esc(s.id)}-tit">${esc(s.comun)}</h3>
        <p class="modal__cientifico"><em>${esc(s.cientifico)}</em></p>
        ${renderListaGuia(etiquetas.pasos, s.pasos, true)}
        ${renderListaGuia(etiquetas.cuidados, s.cuidados, false)}
      </div>
    </dialog>`;
}

function renderFichaSemilla(s, etiquetas) {
  return `
    <article class="ficha">
      <div class="ficha__fotos">
        ${renderFoto(s.fotos.semilla, etiquetas.fotoSemilla, etiquetas.fotoPendiente)}
        ${renderFoto(s.fotos.germinado, etiquetas.fotoGerminado, etiquetas.fotoPendiente)}
      </div>
      <div class="ficha__cabecera">
        <h3 class="ficha__comun">${esc(s.comun)}</h3>
        <p class="ficha__cientifico"><em>${esc(s.cientifico)}</em></p>
      </div>
      <p class="ficha__desc">${esc(s.descripcion)}</p>
      <dl class="ficha__datos">
        <div><dt>Familia</dt><dd>${esc(s.familia)}</dd></div>
        <div><dt>Germina</dt><dd>${esc(s.germina)}</dd></div>
        <div><dt>Porte</dt><dd>${esc(s.porte)}</dd></div>
      </dl>
      <button class="ficha__cta" data-modal="guia-${esc(s.id)}">
        ${esc(etiquetas.guiaCta)}
      </button>
      ${renderModalGuia(s, etiquetas)}
    </article>`;
}

// Sección de semillas en tono "mesa de herbario": las fichas quietas y
// precisas (son el contenido); alrededor, un blob oro y el puente a custodios.
export function renderSemillas(semillas, seccion, puente) {
  const fichas = semillas
    .map((s) => renderFichaSemilla(s, seccion.etiquetas))
    .join("");
  return `
    <section class="seccion herbario" id="semillas">
      <div class="blob blob--b" aria-hidden="true"></div>
      ${seccion.eyebrow ? `<p class="eyebrow">${esc(seccion.eyebrow)}</p>` : ""}
      <h2 class="seccion__titulo">${esc(seccion.titulo)}</h2>
      <p class="seccion__intro">${texto(seccion.intro)}</p>
      <div class="fichas">${fichas}</div>
      ${puente ? renderPuenteCustodios(puente) : ""}
    </section>`;
}

// Puente al final de la sección de semillas → página de custodios.
// Un recorte "pegado con cinta": toda la tarjeta es un enlace.
function renderPuenteCustodios(p) {
  const foto = p.foto?.src
    ? `<img class="puente__foto" src="${esc(p.foto.src)}" alt="${esc(p.foto.alt)}" />`
    : `<span class="puente__foto puente__foto--ph" aria-hidden="true">foto<br />custodio</span>`;
  return `
    <a class="puente cinta" href="${esc(p.url)}" data-entra>
      ${foto}
      <span class="puente__texto">${marcar(p.texto)}</span>
      <span class="puente__cta">${esc(p.cta)}</span>
    </a>`;
}
