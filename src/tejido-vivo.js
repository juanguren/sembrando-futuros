// ─────────────────────────────────────────────────────────────────────────
//  TEJIDO VIVO · lo que pasa al hacer scroll
//
//  1 · Revelado gradual. Los bloques con [data-entra] entran suaves, al ritmo
//      del scroll. Si el navegador soporta animation-timeline, lo hace el
//      CSS solo; si no, aquí se marcan con IntersectionObserver y entran por
//      tiempo (respaldo).
//  2 · La fogata. La brasa se enciende cuando el hogar llega a la vista —una
//      sola vez— y desde entonces suben chispas.
//
//  Con prefers-reduced-motion todo queda quieto: nada se oculta ni vuela.
//  Los números viven en tejido-vivo.ajustes.js.
// ─────────────────────────────────────────────────────────────────────────
import { crearAzar, alAzarEntre } from "./azar.js";
import { REVELADO, FOGATA, CHISPAS, SELECTORES, CLASES } from "./tejido-vivo.ajustes.js";

const prefiereQuietud = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const elCssRevelaSolo = () => !!CSS.supports?.("animation-timeline: view()");

// ═══ 1 · Revelado por tiempo (respaldo) ═══════════════════════════════════

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

// ═══ 2 · La fogata ════════════════════════════════════════════════════════

function encenderAlLlegar(fogata) {
  const hogar = fogata.querySelector(SELECTORES.hogar) || fogata;
  if (!("IntersectionObserver" in window)) {
    fogata.classList.add(CLASES.encendida);
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;
    fogata.classList.add(CLASES.encendida);
    observador.disconnect();
  }, { threshold: FOGATA.umbralEncendido });
  observador.observe(hogar);
}

function crearChispa(azar) {
  const chispa = document.createElement("span");
  chispa.className = CLASES.chispa;
  const x = alAzarEntre(azar, CHISPAS.x).toFixed(0);
  const tamano = Math.round(alAzarEntre(azar, CHISPAS.tamano));
  const alto = alAzarEntre(azar, CHISPAS.alto).toFixed(0);
  const deriva = alAzarEntre(azar, CHISPAS.deriva).toFixed(0);
  const duracion = alAzarEntre(azar, CHISPAS.duracion).toFixed(1);
  const desfase = (-alAzarEntre(azar, CHISPAS.desfase)).toFixed(1);
  chispa.style.cssText =
    `left:${x}px; width:${tamano}px; height:${tamano}px;` +
    ` --alto:${alto}px; --deriva:${deriva}px; --dur:${duracion}s; --delay:${desfase}s;`;
  return chispa;
}

function sembrarChispas(fogata) {
  const nido = fogata.querySelector(SELECTORES.chispas);
  if (!nido) return;
  const azar = crearAzar(CHISPAS.semilla);
  nido.append(...Array.from({ length: CHISPAS.cantidad }, () => crearChispa(azar)));
}

// ═══ Entrada pública ══════════════════════════════════════════════════════

export function initTejidoVivo() {
  const quieto = prefiereQuietud();
  if (!quieto && !elCssRevelaSolo()) revelarPorJs();

  const fogata = document.querySelector(SELECTORES.fogata);
  if (!fogata) return;
  encenderAlLlegar(fogata);
  if (!quieto) sembrarChispas(fogata);
}
