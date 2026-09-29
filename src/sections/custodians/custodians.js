/* ═══════════════════════════════════════════════════════════════════════
   PÁGINA /custodios — formato featuring, arco ALTAR → VERBENA.
   Lenguaje suelto: recortes con cinta, marcador, polaroids, blobs.
   ═══════════════════════════════════════════════════════════════════════ */
import "./custodians.css";
import { esc, texto, marcar } from "../../shared/html.js";

// 1 · El video del custodio (altar) con su cita montada encima.
export function renderCustodioFeaturing(f) {
  const video = f.video.src
    ? `<video class="cvideo__video" controls preload="none" playsinline
         ${f.video.poster ? `poster="${esc(f.video.poster)}"` : ""}
         src="${esc(f.video.src)}"></video>`
    : `<div class="cvideo__ph">
         <span class="cvideo__play" aria-hidden="true">
           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
         </span>
         <span class="cvideo__nota">${esc(f.video.nota)} · video pendiente</span>
       </div>`;
  return `
    <section class="seccion cvideo" id="custodio">
      <div class="blob blob--a" aria-hidden="true"></div>
      <div class="cvideo__marco">
        <span class="cvideo__marca">${esc(f.marca)}</span>
        ${video}
      </div>
      <div class="cita-recorte cinta">
        <blockquote class="cita-recorte__cita">${esc(f.cita)}</blockquote>
        <p class="cita-recorte__firma"><b>${esc(f.nombre)}</b> · ${esc(f.rol)}</p>
      </div>
    </section>`;
}

// 2 · Qué es custodiar — notas sueltas, desalineadas a propósito.
export function renderQueEsCustodiar(q) {
  const notas = q.notas
    .map(
      (n, i) => `
      <div class="nota nota--${i + 1}">
        <b class="nota__titulo">${esc(n.titulo)}</b>
        <span class="nota__texto">${texto(n.texto)}</span>
      </div>`
    )
    .join("");
  return `
    <section class="seccion quees">
      <div class="blob blob--b" aria-hidden="true"></div>
      <h2 class="seccion__titulo quees__titulo">${marcar(q.titulo)}</h2>
      <div class="notas">${notas}</div>
    </section>`;
}

// 3 · Mesa de fotos: polaroids sueltas; cada una amplía en el lightbox.
export function renderMesaFotos(fotos) {
  const items = fotos.items
    .map((f, i) => {
      const cuerpo = f.src
        ? `<button class="polaroid__btn" data-full="${esc(f.src)}" data-alt="${esc(f.alt)}"
             aria-label="Ampliar: ${esc(f.alt)}">
             <img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" /></button>`
        : `<div class="polaroid__ph">foto ${i + 1}</div>`;
      return `
      <figure class="polaroid polaroid--${i + 1}${i % 2 === 0 ? " cinta" : ""}">
        ${cuerpo}
        <figcaption class="polaroid__pie">${esc(f.pie)}</figcaption>
      </figure>`;
    })
    .join("");
  return `
    <section class="seccion mesa-seccion">
      <h2 class="seccion__titulo mesa__titulo">${marcar(fotos.titulo)}</h2>
      <div class="mesa">${items}</div>
      <p class="mesa__hint">← desliza →</p>
    </section>`;
}

// 4 · Bancos de semillas: de la mano del custodio a tu sobre.
export function renderBancosSemillas(b) {
  const parrafos = b.parrafos.map((p) => `<p>${esc(p)}</p>`).join("");
  return `
    <section class="seccion bancos">
      <div class="blob blob--c1" aria-hidden="true"></div>
      <div class="blob blob--c2" aria-hidden="true"></div>
      <h2 class="seccion__titulo bancos__titulo">${marcar(b.titulo)}</h2>
      <div class="bancos__cuerpo">${parrafos}</div>
    </section>`;
}

// 5 · Slots para los próximos custodios (2–3 máx).
export function renderProximosCustodios(proximos) {
  if (!proximos?.length) return "";
  const slots = proximos
    .map(
      (t, i) => `
      <div class="proximo proximo--${i % 2 ? "b" : "a"}">
        <span class="proximo__foto" aria-hidden="true"></span>
        <p>${esc(t)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion proximos-seccion">
      <div class="proximos">${slots}</div>
    </section>`;
}
