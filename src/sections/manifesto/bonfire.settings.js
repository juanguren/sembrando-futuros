// ─────────────────────────────────────────────────────────────────────────
//  FOGATA · ajustes
//
//  Lo afinable de la brasa y las chispas. Sin lógica; objetos congelados.
//  La lógica está en bonfire.js.
// ─────────────────────────────────────────────────────────────────────────


// La brasa se enciende cuando esta fracción del hogar está en pantalla.
export const FOGATA = Object.freeze({
  umbralEncendido: 0.4,
});

// Chispas que suben desde la brasa. Rangos [mínimo, máximo].
export const CHISPAS = Object.freeze({
  cantidad: 14,
  semilla: 3,                  // del azar: el reparto de chispas es siempre el mismo
  x: [-150, 150],              // px desde el centro de la brasa
  tamano: [3, 7],              // px
  alto: [90, 230],             // px que sube antes de apagarse
  deriva: [-26, 26],           // px de desvío lateral al subir
  duracion: [3.6, 7.5],        // segundos por vuelo
  desfase: [0, 7],             // segundos; se aplica en negativo: ya están en vuelo al llegar
});

export const SELECTORES = Object.freeze({
  fogata: ".fogata",
  hogar: ".fogata__hogar",     // el bloque del fuego: lo que se observa para encender
  chispas: ".fogata__chispas",
});

export const CLASES = Object.freeze({
  encendida: "is-encendida",
  chispa: "chispa",
});
