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

document.title = sitio.tituloPagina;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute("content", sitio.descripcion);

document.querySelector("#app").innerHTML = [
  renderNav(sitio),
  `<main>`,
  renderHero(hero),
  renderEvento(evento),
  renderQueHago(queHago),
  renderSemillas(semillas, semillasSeccion, puenteCustodios),
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

// ── Envío del formulario de registro ─────────────────────────────────────
// POST al `registro.endpoint` (Formspree/Web3Forms/Google Form → CSV). Sin
// endpoint configurado corre en modo demo (no envía, solo muestra éxito).
(() => {
  const form = document.querySelector(".registro__form");
  if (!form) return;
  const estado = form.querySelector(".registro__estado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot: bot → se descarta en silencio
    if (!form.checkValidity()) return form.reportValidity();

    const datos = new FormData(form);
    datos.delete("website");
    if (registro.accessKey) datos.append("access_key", registro.accessKey);

    estado.className = "registro__estado";
    estado.textContent = registro.enviando;

    if (!registro.endpoint) {
      // Modo demo: sin receptor configurado todavía.
      estado.classList.add("is-ok");
      estado.textContent = registro.exito + " (demo: falta configurar el endpoint)";
      form.reset();
      return;
    }
    try {
      const res = await fetch(registro.endpoint, {
        method: "POST",
        body: datos,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      estado.classList.add("is-ok");
      estado.textContent = registro.exito;
      form.reset();
    } catch {
      estado.classList.add("is-error");
      estado.textContent = registro.error;
    }
  });
})();

// Selector flotante de temas (herramienta temporal de exploración).
initTemaExplorador();
