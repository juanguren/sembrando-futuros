// ─────────────────────────────────────────────────────────────────────────
//  RENDER
//
//  Funciones puras que toman el contenido (content.js) y devuelven el HTML.
//  Aquí no vive ningún texto del sitio: solo la *forma*. Cuando migres a
//  Astro, cada función de abajo se vuelve un componente .astro.
// ─────────────────────────────────────────────────────────────────────────

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function renderNav(sitio) {
  return `
    <nav class="nav" aria-label="Navegación principal">
      <a class="nav__logo" href="#inicio">${esc(sitio.nombre)}</a>
      <input type="checkbox" id="nav-toggle" class="nav__toggle" />
      <label for="nav-toggle" class="nav__burger" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </label>
      <ul class="nav__links">
        <li><a href="#semillas">Semillas</a></li>
        <li><a href="#filosofia">Por qué</a></li>
        <li><a href="#aliados">Aliados</a></li>
      </ul>
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
        <p class="eyebrow">${esc(hero.eyebrow)}</p>
        <h1 class="hero__titulo">${esc(hero.titulo)}</h1>
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

// Una foto de la ficha. Si hay "src", es un botón que abre el lightbox.
function renderFoto(foto, etiqueta) {
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
      <div class="foto__marco"><span class="foto__pendiente">foto pendiente</span></div>
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
function renderModalGuia(s) {
  return `
    <dialog class="modal" id="guia-${esc(s.id)}" aria-labelledby="guia-${esc(s.id)}-tit">
      <div class="modal__caja">
        <button class="modal__cerrar" data-close aria-label="Cerrar">&times;</button>
        <p class="modal__eyebrow">cómo sembrarla</p>
        <h3 class="modal__titulo" id="guia-${esc(s.id)}-tit">${esc(s.comun)}</h3>
        <p class="modal__cientifico"><em>${esc(s.cientifico)}</em></p>
        ${renderListaGuia("Paso a paso", s.pasos, true)}
        ${renderListaGuia("Cuidados", s.cuidados, false)}
      </div>
    </dialog>`;
}

function renderFichaSemilla(s) {
  return `
    <article class="ficha">
      <div class="ficha__fotos">
        ${renderFoto(s.fotos.semilla, "la semilla")}
        ${renderFoto(s.fotos.germinado, "al germinar")}
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
        Cómo sembrarla y cuidarla
      </button>
      ${renderModalGuia(s)}
    </article>`;
}

export function renderSemillas(semillas) {
  return `
    <section class="seccion" id="semillas">
      <p class="eyebrow">en tu sobre</p>
      <h2 class="seccion__titulo">Lo que llevas contigo</h2>
      <p class="seccion__intro">
        Una pequeña mezcla curada por bancos de semillas de la sabana.
        Estas son las que podrías tener entre manos.
      </p>
      <div class="fichas">
        ${semillas.map(renderFichaSemilla).join("")}
      </div>
    </section>`;
}

export function renderFilosofia(f) {
  const parrafos = f.parrafos.map((p) => `<p>${esc(p)}</p>`).join("");
  return `
    <section class="seccion filosofia" id="filosofia">
      <p class="eyebrow">${esc(f.eyebrow)}</p>
      <blockquote class="filosofia__cita">${esc(f.cita)}</blockquote>
      <div class="filosofia__cuerpo">${parrafos}</div>
    </section>`;
}

export function renderAliados(aliados) {
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
      <p class="eyebrow">no lo hacemos solos</p>
      <h2 class="seccion__titulo">Quienes siembran con nosotros</h2>
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
