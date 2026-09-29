// ─────────────────────────────────────────────────────────────────────────
//  FOGATA · la brasa del manifiesto y sus chispas
//
//  La brasa se enciende cuando el hogar llega a la vista —una sola vez— y
//  desde entonces suben chispas (azar con semilla: siempre las mismas).
//  Con prefers-reduced-motion no suben. Los números viven en
//  bonfire.settings.js.
// ─────────────────────────────────────────────────────────────────────────

import { crearAzar, alAzarEntre } from "../../shared/random.js";
import { FOGATA, CHISPAS, SELECTORES, CLASES } from "./bonfire.settings.js";

const prefiereQuietud = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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

export function initFogata() {
  const fogata = document.querySelector(SELECTORES.fogata);
  if (!fogata) return;
  encenderAlLlegar(fogata);
  if (!prefiereQuietud()) sembrarChispas(fogata);
}
