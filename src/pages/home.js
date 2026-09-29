// ─────────────────────────────────────────────────────────────────────────
//  PÁGINA PRINCIPAL · punto de entrada
//
//  Qué secciones van y en qué orden. Cada sección trae su marcado y su estilo
//  desde su carpeta en sections/; el contenido viene de content.js. Para
//  agregar una sección: impórtala aquí y súmala a la lista de abajo.
// ─────────────────────────────────────────────────────────────────────────

import "../styles/global.css";
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
} from "../content.js";
import { renderNav } from "../sections/nav/nav.js";
import { renderHero } from "../sections/hero/hero.js";
import { initHeroVivo } from "../sections/hero/hero-motion.js";
import { renderEvento } from "../sections/festival/festival.js";
import { renderSemillas } from "../sections/seeds/seeds.js";
import { renderQueHago } from "../sections/steps/steps.js";
import { renderFilosofia } from "../sections/manifesto/manifesto.js";
import { initFogata } from "../sections/manifesto/bonfire.js";
import { renderAliados } from "../sections/allies/allies.js";
import { renderColectivoSumate } from "../sections/join/join.js";
import { initRegistro } from "../sections/join/signup.js";
import { renderLightbox } from "../shared/lightbox.js";
import { initInteracciones } from "../shared/interactions.js";
import { initRevelado } from "../shared/reveal.js";
import { initTemaExplorador } from "../tools/theme-explorer.js";

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

// Revelado gradual al hacer scroll (respaldo para navegadores sin scroll timeline).
initRevelado();

// La fogata del manifiesto: la brasa se enciende al llegar y suben chispas.
initFogata();

// Envío del formulario de registro (compartido con /custodios).
initRegistro(registro);

// Selector flotante de temas (herramienta temporal de exploración).
initTemaExplorador();
