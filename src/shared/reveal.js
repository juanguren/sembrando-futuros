// ─────────────────────────────────────────────────────────────────────────
//  REVELADO · los bloques entran suaves al hacer scroll
//
//  Los bloques con [data-entra] entran al ritmo del scroll. Si el navegador
//  soporta animation-timeline, lo hace el CSS solo (styles/reveal.css); si
//  no, aquí se marcan con IntersectionObserver y entran por tiempo.
//  Con prefers-reduced-motion todo queda quieto. Los números viven en
//  reveal.settings.js.
// ─────────────────────────────────────────────────────────────────────────

import { REVELADO, SELECTORES, CLASES } from "./reveal.settings.js";

const prefiereQuietud = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const elCssRevelaSolo = () => !!CSS.supports?.("animation-timeline: view()");

function revelarPorJs() {
  const bloques = document.querySelectorAll(SELECTORES.revelables);
  if (!bloques.length || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add(CLASES.reveladoPorJs);
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add(CLASES.visible);
      observador.unobserve(entrada.target);
    }
  }, { threshold: REVELADO.umbral });
  bloques.forEach((bloque) => observador.observe(bloque));
}

export function initRevelado() {
  if (!prefiereQuietud() && !elCssRevelaSolo()) revelarPorJs();
}
