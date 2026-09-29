import "./style.css";
import {
  sitio,
  hero,
  evento,
  queHago,
  semillas,
  semillasSeccion,
  puenteCustodios,
  filosofia,
  colectivo,
  registro,
  aliados,
  aliadosSeccion,
} from "./content.js";
import {
  renderNav,
  renderHero,
  renderEvento,
  renderQueHago,
  renderSemillas,
  renderFilosofia,
  renderColectivoSumate,
  renderAliados,
  renderLightbox,
} from "./render.js";
import { initInteracciones } from "./interacciones.js";
import { initTemaExplorador } from "./tema-explorador.js";
import { initHeroVivo } from "./hero-vivo.js";
import { initTejidoVivo } from "./tejido-vivo.js";
import { initRegistro } from "./registro.js";

document.title = sitio.tituloPagina;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute("content", sitio.descripcion);

document.querySelector("#app").innerHTML = [
  renderNav(sitio),
  `<main>`,
  renderHero(hero),
  renderEvento(evento),
  renderSemillas(semillas, semillasSeccion, puenteCustodios),
  renderQueHago(queHago),
  renderFilosofia(filosofia),
  renderAliados(aliados, aliadosSeccion),
  renderColectivoSumate(colectivo, registro),
  `</main>`,
  renderLightbox(),
].join("");

// Menú móvil, modales, lightbox y Escape (compartido entre páginas).
initInteracciones();

// Hero vivo: confeti de semillas + palabra rotativa (futuros/semillas/esperanza).
initHeroVivo(hero.tituloRota);

// Tejido vivo: revelado gradual al hacer scroll y la fogata (brasa + chispas).
initTejidoVivo();

// Envío del formulario de registro (compartido con /custodios).
initRegistro(registro);

// Selector flotante de temas (herramienta temporal de exploración).
initTemaExplorador();
