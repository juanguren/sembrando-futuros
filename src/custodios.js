// ─────────────────────────────────────────────────────────────────────────
//  PÁGINA /custodios · punto de entrada
//
//  Custodios y custodias de semillas: formato featuring con arco emocional
//  altar (testimonio en silencio) → verbena (fiesta al cierre). La verbena es
//  la misma banda final de la página principal: colectividad + súmate.
//  Contenido en content.js (custodiosPagina), marcado en render.js,
//  estética en style.css. Igual que index: nada de texto aquí.
// ─────────────────────────────────────────────────────────────────────────
import "./style.css";
import { sitio, custodiosPagina as pagina, colectivo, registro } from "./content.js";
import {
  renderNav,
  renderCustodioFeaturing,
  renderQueEsCustodiar,
  renderMesaFotos,
  renderBancosSemillas,
  renderProximosCustodios,
  renderColectivoSumate,
  renderLightbox,
} from "./render.js";
import { initInteracciones } from "./interacciones.js";
import { initTemaExplorador } from "./tema-explorador.js";
import { initRegistro } from "./registro.js";

document.title = pagina.tituloPagina;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute("content", pagina.descripcion);

document.querySelector("#app").innerHTML = [
  renderNav(sitio),
  `<main class="custodios">`,
  renderCustodioFeaturing(pagina.featuring),
  renderQueEsCustodiar(pagina.queEs),
  renderMesaFotos(pagina.fotos),
  renderBancosSemillas(pagina.bancos),
  renderProximosCustodios(pagina.proximos),
  renderColectivoSumate(colectivo, registro),
  `</main>`,
  renderLightbox(),
].join("");

// Menú móvil, lightbox de las polaroids y Escape (compartido entre páginas).
initInteracciones();

// Envío del formulario de registro (el mismo de la página principal).
initRegistro(registro);

// Selector flotante de temas (herramienta temporal de exploración).
initTemaExplorador();
