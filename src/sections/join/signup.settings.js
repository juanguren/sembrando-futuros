// ─────────────────────────────────────────────────────────────────────────
//  REGISTRO · ajustes del botón
//
//  Lo afinable del botón "Quiero enterarme". Sin lógica; objetos congelados.
//  La lógica está en signup.js; el aspecto de cada estado, en join.css.
// ─────────────────────────────────────────────────────────────────────────

export const BOTON = Object.freeze({
  enviandoMinimo: 700,         // ms que dura "Sembrando…" aunque MailerLite responda antes
  listoDura: 2600,             // ms en "¡Sembrado!" antes de volver a "Quiero enterarme"
});

// Las hojas y semillas que saltan del botón cuando el registro queda.
export const BROTE = Object.freeze({
  piezas: 7,
  distancias: [48, 80],        // px; alterna corta y larga para que el abanico no se vea plano
  abanico: [-160, -20],        // grados; negativo es hacia arriba
});
