// ─────────────────────────────────────────────────────────────────────────
//  AZAR CON SEMILLA
//
//  Generador determinista (algoritmo mulberry32): con la misma semilla, la
//  misma secuencia. Lo usan el confeti del hero y las chispas de la fogata
//  para que cada composición sea SIEMPRE la misma — un reparto aleatorio de
//  verdad sería imposible de aprobar (cada carga, otra cosa).
// ─────────────────────────────────────────────────────────────────────────

export function crearAzar(semilla) {
  let estado = semilla;
  return () => {
    estado |= 0;
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Un valor dentro de un rango [mínimo, máximo] y un elemento de una lista.
export const alAzarEntre = (azar, [min, max]) => min + azar() * (max - min);
export const alAzarDe = (azar, lista) => lista[Math.floor(azar() * lista.length)];
