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

// Convierte [[palabra]] en <mark>palabra</mark> (resaltado de marcador),
// escapando todo lo demás. Se usa en títulos/textos del contenido.
const marcar = (s) => esc(s).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>");

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
        <h1 class="hero__titulo">${esc(hero.tituloAntes)} <span class="hero__rota" data-rota><span class="hero__rota-cap">${esc(hero.tituloRota[0])}</span></span> ${esc(hero.tituloDespues)}</h1>
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

// Banda del evento en tono "cartelera de barrio": las tres tarjetas son notas
// pegadas al tablón (giradas, escalonadas) y un blob lima asoma por un lado.
export function renderEvento(evento) {
  const notas = evento.tarjetas
    .map(
      (t, i) => `
      <div class="nota nota--${i + 1}" data-entra>
        <p class="nota__k">${esc(t.k)}</p>
        <h3 class="nota__titulo">${esc(t.titulo)}</h3>
        <p class="nota__texto">${esc(t.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion seccion--alt cartelera" id="evento">
      <div class="blob blob--a" aria-hidden="true"></div>
      ${evento.eyebrow ? `<p class="eyebrow">${esc(evento.eyebrow)}</p>` : ""}
      <h2 class="seccion__titulo">${esc(evento.titulo)}</h2>
      <p class="seccion__intro">${esc(evento.intro)}</p>
      <div class="notas">${notas}</div>
    </section>`;
}

// Banda "¿y ahora qué?" en tono "brote": los tres pasos crecen de izquierda
// a derecha y el número deja de ser un círculo: semilla → brote → hoja.
export function renderQueHago(queHago) {
  const pasos = queHago.pasos
    .map(
      (p, i) => `
      <div class="paso paso--${i + 1}" data-entra>
        <h3 class="paso__titulo">${esc(p.titulo)}</h3>
        <p class="paso__texto">${esc(p.texto)}</p>
      </div>`
    )
    .join("");
  return `
    <section class="seccion brote" id="pasos">
      ${queHago.eyebrow ? `<p class="eyebrow">${esc(queHago.eyebrow)}</p>` : ""}
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
      <p class="seccion__intro">${esc(seccion.intro)}</p>
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

// El manifiesto en tono "fogata": anochece, se enciende una brasa y los tres
// beats son las tres piedras de la tulpa alrededor del fuego. En la pared,
// las sombras de las plantas tiemblan con la luz. tejido-vivo.js enciende la
// brasa al llegar y hace subir las chispas.
export function renderFilosofia(f) {
  const piedras = f.beats
    .map(
      (b, i) => `
      <div class="piedra piedra--${i + 1}" data-entra>
        <b class="piedra__verbo">${esc(b.titulo)}</b>
        <span class="piedra__texto">${esc(b.texto)}</span>
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
        <div class="tulpa">${piedras}</div>
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

// Piezas del confeti del hero que vuelven en la banda final (forma, tono).
// Sus posiciones y vuelo viven en style.css (.vuelta__confeti).
const CONFETI_VUELTA = [
  ["semilla", "tinta"], ["hoja", "crema"], ["punto", "tinta"], ["brote", "crema"],
  ["semilla", "crema"], ["punto", "arcilla"], ["hoja", "tinta"], ["brote", "tinta"],
];

// Banda final en tono "vuelta a la verbena": el mismo cierre en fiesta que
// /custodios (fondo acento, blobs, título girado), el formulario como un
// recorte de papel pegado con cinta y unas piezas del confeti del hero: el
// ciclo se cierra donde empezó. El envío del form lo engancha main.js;
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
          <p class="verbena__texto">${esc(c.texto)}</p>
          <p class="vuelta__teaser">${esc(c.teaser)}</p>
        </div>
        <div class="vuelta__registro cinta" data-entra>
          <h3 class="vuelta__sub">${esc(r.titulo)}</h3>
          <p class="vuelta__intro">${esc(r.intro)}</p>
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

/* ═══════════════════════════════════════════════════════════════════════
   PÁGINA /custodios — formato featuring, arco ALTAR → VERBENA.
   Lenguaje suelto: recortes con cinta, marcador, polaroids, blobs.
   ═══════════════════════════════════════════════════════════════════════ */

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
        <span class="nota__texto">${esc(n.texto)}</span>
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

// 6 · Cierre en VERBENA: al sembrar, tú también custodias.
export function renderCierreVerbena(c) {
  return `
    <footer class="verbena">
      <div class="verbena__blob1" aria-hidden="true"></div>
      <div class="verbena__blob2" aria-hidden="true"></div>
      <div class="verbena__contenido">
        <h2 class="verbena__titulo">${marcar(c.titulo)}</h2>
        <p class="verbena__texto">${esc(c.texto)}</p>
        <div class="verbena__ctas">
          <a class="btn verbena__btn-principal" href="${esc(c.ctaPrincipal.url)}">${esc(c.ctaPrincipal.texto)}</a>
          <a class="btn verbena__btn-borde" href="${esc(c.ctaSecundario.url)}">${esc(c.ctaSecundario.texto)}</a>
        </div>
      </div>
    </footer>`;
}
