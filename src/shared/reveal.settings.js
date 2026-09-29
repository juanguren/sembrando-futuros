// ─────────────────────────────────────────────────────────────────────────
//  REVELADO · ajustes
//
//  Lo afinable del revelado al hacer scroll. Sin lógica; objetos congelados.
//  La lógica está en reveal.js.
// ─────────────────────────────────────────────────────────────────────────


// Revelado de los bloques [data-entra] cuando el navegador NO soporta
// animaciones ligadas al scroll (si las soporta, lo hace el CSS solo).
export const REVELADO = Object.freeze({
  umbral: 0.18,                // fracción visible del bloque para darlo por entrado
});

export const SELECTORES = Object.freeze({
  revelables: "[data-entra]",
});

export const CLASES = Object.freeze({
  reveladoPorJs: "js-entra",   // en <html>: el CSS deja los bloques ocultos hasta que JS los marca
  visible: "is-visible",
});
