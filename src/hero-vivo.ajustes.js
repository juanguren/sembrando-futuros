// ─────────────────────────────────────────────────────────────────────────
//  HERO VIVO · ajustes
//
//  Todo lo afinable del confeti y la palabra rotativa, sin una línea de
//  lógica. Está en tres capas según QUIÉN lo toca:
//
//   · DISEÑO       lo que se mueve con el ojo: cuánto confeti, qué tan
//                  grande, cómo vuela, a qué ritmo cambia la palabra.
//   · ESTRUCTURA   cómo se lee el hero: qué texto se esquiva y con cuánto
//                  margen, y qué tipos de hueco existen y cómo se comportan.
//   · TOLERANCIAS  geometría fina del algoritmo. Rara vez hay que tocarla.
//
//  Cambiar un número aquí no requiere entender el algoritmo de hero-vivo.js.
//  Los objetos van congelados: son datos, no estado.
// ─────────────────────────────────────────────────────────────────────────

// ═══ DISEÑO ═══════════════════════════════════════════════════════════════

// "Brisa": pocas piezas, muy repartidas, con acento en los huecos junto al
// texto — sobre todo el costado de los hashtags, que es puro espacio negativo.
export const BRISA = Object.freeze({
  cantidad: 19,
  tamanoMin: 10,               // px
  tamanoMax: 20,
  semilla: 7,                  // del generador aleatorio: cambiarla cambia toda la composición
  // Cuánto cupo recibe cada tipo de hueco (los tipos, en TIPOS_DE_HUECO)
  sesgoPorTipo: Object.freeze({
    derecha: 1.8, entre: 1.2, margenSuperior: 1, margenInferior: 1, sobre: 0.5,
  }),
  // Los textos marcados `destacado` en TEXTOS (los hashtags) reciben más:
  prioridadDestacados: 4,      // multiplica el cupo de sus huecos laterales
  minimoJuntoADestacados: 4,   // piezas garantizadas junto a cada una de sus líneas
});

// Rangos [mínimo, máximo] del movimiento. Las piezas de la zona alta y las
// que van sobre el paquete "vuelan" (más recorrido, en diagonal); las que
// están encajadas entre líneas apenas flotan.
export const VUELO = Object.freeze({
  giroInicial: [-40, 40],      // grados
  alto:  Object.freeze({ dx: [-8, 8], dy: [8, 24], giro: [6, 24] }),   // px, px, grados
  suave: Object.freeze({ dx: [-3, 3], dy: [4, 10], giro: [3, 9] }),
  duracion: [4.5, 9.5],        // segundos por ciclo
  desfase: [0, 7],             // segundos; se aplica en negativo: cada pieza
                               // arranca a mitad de su ciclo, sin latido común
  opacidad: [0.55, 0.85],
});

// Palabra rotativa del título (futuros / semillas / esperanza).
export const PALABRA = Object.freeze({
  intervalo: 3400,             // ms entre una palabra y la siguiente
  fundido: 380,                // ms que la palabra está invisible al cambiar;
                               // igual a la transición de .hero__rota-cap en style.css
  recorrido: "0.22em",         // cuánto sube al salir y desde dónde entra la siguiente
});

// ms de calma tras un resize antes de volver a medir y sembrar.
export const ESPERA_TRAS_RESIZE = 200;

// Clases CSS del confeti. Las formas son máscaras SVG y los tonos son
// variables del tema, así el confeti acompaña los dos temas.
export const FORMAS = Object.freeze(["semilla", "brote", "hoja", "punto"]);
export const TONOS  = Object.freeze(["lima", "acento", "arcilla", "sabana"]);

// ═══ ESTRUCTURA ═══════════════════════════════════════════════════════════

// Clases que el módulo CREA (las demás solo las consulta).
export const CLASES = Object.freeze({
  capsula: "hero__rota-cap",      // la palabra rotativa en sí
  confeti: "confeti",
});

export const SELECTORES = Object.freeze({
  hero: ".hero",
  palabra: "[data-rota]",         // contenedor de la palabra rotativa
  capsula: `.${CLASES.capsula}`,
  media: ".hero__media-marco",    // el cuadro del paquete
  confeti: `.${CLASES.confeti}`,
});

// Qué texto esquiva el confeti. El ORDEN importa: es el orden en que se
// detectan los huecos y, por tanto, en que se reparte el cupo.
//   margen       → px de respeto alrededor de cada línea
//   medir        → "lineas" (renglón a renglón, ceñido a los glifos)
//                  o "caja" (el rectángulo del elemento; para botones)
//   pesoDerecha  → peso del hueco a su derecha (si falta, el del tipo "derecha")
//   destacado    → sus huecos laterales reciben la prioridad de BRISA
export const TEXTOS = Object.freeze([
  Object.freeze({ selector: ".hero__titulo",   margen: 12, medir: "lineas", pesoDerecha: 3 }),
  Object.freeze({ selector: ".hero__hashtags", margen: 7,  medir: "lineas", destacado: true }),
  Object.freeze({ selector: ".hero__parrafo",  margen: 6,  medir: "lineas" }),
  Object.freeze({ selector: ".hero__ctas a",   margen: 9,  medir: "caja" }),
]);

// Cada tipo de hueco declara cómo se comporta, así el algoritmo de colocación
// no necesita ramas especiales.
//   peso          → cuánto cupo recibe (se combina con el sesgo de BRISA)
//   esquivaTexto  → si sus piezas deben evitar las líneas de texto
//   separacion    → distancia mínima entre piezas (× la suma de sus tamaños)
//   vuela         → si sus piezas usan siempre el movimiento "alto"
//   capa          → z-index; solo "sobre" va por delante del paquete
export const TIPOS_DE_HUECO = Object.freeze({
  derecha:        Object.freeze({ peso: 2, esquivaTexto: true,  separacion: 0.5 }),
  entre:          Object.freeze({ peso: 2, esquivaTexto: true,  separacion: 0.5 }),
  margenSuperior: Object.freeze({ peso: 3, esquivaTexto: true,  separacion: 0.5,  vuela: true }),
  margenInferior: Object.freeze({ peso: 1, esquivaTexto: true,  separacion: 0.5,  vuela: true }),
  sobre:          Object.freeze({ peso: 2, esquivaTexto: false, separacion: 0.75, vuela: true, capa: 3 }),
});

// ═══ TOLERANCIAS ══════════════════════════════════════════════════════════

export const GEOMETRIA = Object.freeze({
  huecoMinimo: 22,             // px libres para que un espacio cuente como hueco
  alturaMinimaLinea: 14,       // px; renglones más bajos no generan hueco lateral
  respiro: 4,                  // px entre el final de una línea y su hueco
  borde: 2,                    // px de margen contra los bordes del hero
  tolerancia: 2,               // px de holgura al comprobar solapes entre bloques
  rectoMinimo: 2,              // px; rectángulos más chicos se ignoran (glifos vacíos)
  holguraMinima: 2,            // px sobrantes mínimos para intentar colocar una pieza
  maxIntentos: 160,            // por hueco, antes de darlo por lleno
  zonaAlta: 0.45,              // fracción superior del hero cuyas piezas "vuelan"
});
