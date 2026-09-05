// ─────────────────────────────────────────────────────────────────────────
//  RENDER
//
//  Funciones puras que toman el contenido (content.js) y devuelven el HTML.
//  Aquí no vive ningún texto del sitio: solo la *forma*. Cuando migres a
//  Astro, cada función de abajo se vuelve un componente .astro.
// ─────────────────────────────────────────────────────────────────────────

// Escapa para texto Y para atributos: incluye comillas, porque muchos valores
// se interpolan dentro de atributos (href, data-*, id). Correcto por defecto,
// también cuando el contenido venga de un CMS.
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function renderNav(sitio) {
  const enlaces = sitio.nav
    .map((l) => `<li><a href="${esc(l.ancla)}">${esc(l.texto)}</a></li>`)
    .join("");
  return `
    <nav class="nav" aria-label="Navegación principal">
      <a class="nav__logo" href="#inicio">${esc(sitio.nombre)}</a>
      <input type="checkbox" id="nav-toggle" class="nav__toggle" />
      <label for="nav-toggle" class="nav__burger" aria-label="Abrir menú"
             aria-controls="nav-menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </label>
      <ul class="nav__links" id="nav-menu">${enlaces}</ul>
    </nav>`;
}

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
        <h1 class="hero__titulo">${esc(hero.titulo)}</h1>
        ${
          hero.hashtags?.length
            ? `<p class="hero__hashtags">${hero.hashtags
                .map((h) => `<span>${esc(h)}</span>`)
                .join("")}</p>`
            : ""
        }
        <p class="hero__parrafo">${esc(hero.parrafo)}</p>
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

// Banda "el evento": qué es, dónde ocurre, la invitación + tarjetas de meta.
export function renderEvento(evento) {
  const tarjetas = evento.tarjetas
    .map(
      (t) => `
      <div class="tarjeta">
        <p class="tarjeta__k">${esc(t.k)}</p>
        <h3 class="tarjeta__titulo">${esc(t.titulo)}</h3>
        <p class="tarjeta__texto">${esc(t.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion seccion--alt" id="evento">
      <p class="eyebrow">${esc(evento.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(evento.titulo)}</h2>
      <p class="seccion__intro">${esc(evento.intro)}</p>
      <div class="grid-tarjetas">${tarjetas}</div>
    </section>`;
}

// Banda "¿y ahora qué?": los 3 pasos, la respuesta rápida a la acción.
export function renderQueHago(queHago) {
  const pasos = queHago.pasos
    .map(
      (p) => `
      <div class="paso">
        <h3 class="paso__titulo">${esc(p.titulo)}</h3>
        <p class="paso__texto">${esc(p.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion" id="pasos">
      <p class="eyebrow">${esc(queHago.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(queHago.titulo)}</h2>
      <div class="pasos">${pasos}</div>
    </section>`;
}

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

export function renderSemillas(semillas, seccion) {
  const fichas = semillas
    .map((s) => renderFichaSemilla(s, seccion.etiquetas))
    .join("");
  return `
    <section class="seccion" id="semillas">
      <p class="eyebrow">${esc(seccion.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(seccion.titulo)}</h2>
      <p class="seccion__intro">${esc(seccion.intro)}</p>
      <div class="fichas">${fichas}</div>
    </section>`;
}

export function renderFilosofia(f) {
  const beats = f.beats
    .map(
      (b) => `
      <div class="beat">
        <b class="beat__titulo">${esc(b.titulo)}</b>
        <span class="beat__texto">${esc(b.texto)}</span>
      </div>`
    )
    .join("");
  return `
    <section class="seccion filosofia" id="filosofia">
      <p class="eyebrow">${esc(f.eyebrow)}</p>
      <blockquote class="filosofia__cita">${esc(f.cita)}</blockquote>
      <div class="filosofia__beats">${beats}</div>
      <button class="btn btn--acento" data-modal="manifiesto-completo">
        ${esc(f.ctaCompleto)}
      </button>
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

// Banda "colectividad": esto es más grande que una web + teaser del mapa.
export function renderColectivo(c) {
  return `
    <section class="seccion colectivo" id="colectivo">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(c.titulo)}</h2>
      <p class="colectivo__texto">${esc(c.texto)}</p>
      <p class="colectivo__teaser">${esc(c.teaser)}</p>
    </section>`;
}

export function renderAliados(aliados, seccion) {
  const items = aliados
    .map((a) => {
      const dentro = a.logo
        ? `<img src="${esc(a.logo)}" alt="${esc(a.nombre)}" />`
        : `<span>${esc(a.nombre)}</span>`;
      return `<a class="aliado" href="${esc(a.url)}">${dentro}</a>`;
    })
    .join("");
  return `
    <section class="seccion seccion--alt" id="aliados">
      <p class="eyebrow">${esc(seccion.eyebrow)}</p>
      <h2 class="seccion__titulo">${esc(seccion.titulo)}</h2>
      <div class="aliados">${items}</div>
    </section>`;
}

export function renderCierre(c) {
  const redes = c.redes
    .map((r) => `<a class="red" href="${esc(r.url)}">${esc(r.nombre)}</a>`)
    .join("");
  return `
    <footer class="cierre">
      <h2 class="cierre__titulo">${esc(c.titulo)}</h2>
      <p class="cierre__texto">${esc(c.texto)}</p>
      <div class="cierre__redes">${redes}</div>
    </footer>`;
}

// Lightbox reutilizable para ampliar cualquier foto.
export function renderLightbox() {
  return `
    <dialog class="lightbox" id="lightbox" aria-label="Imagen ampliada">
      <button class="lightbox__cerrar" data-close aria-label="Cerrar">&times;</button>
      <img class="lightbox__img" src="" alt="" />
    </dialog>`;
}
