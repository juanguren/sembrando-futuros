// ─────────────────────────────────────────────────────────────────────────
//  CONTENIDO DE SEMBRANDO FUTUROS
//
//  Todo lo que dice la página vive aquí, separado del marcado y los estilos.
//  Para cambiar un texto, una semilla, un aliado o un link, edita ESTE archivo.
//  No necesitas tocar render.js ni style.css.
//
//  Cuando migres a Astro, este objeto se convierte casi 1:1 en una
//  "content collection": cada arreglo (semillas, aliados...) pasa a ser una
//  colección de entradas en Markdown o JSON.
// ─────────────────────────────────────────────────────────────────────────

export const sitio = {
  nombre: "sembrando futuros",
  tituloPagina: "sembrando futuros — un puñado de futuro en tus manos",
  descripcion:
    "Recibiste semillas nativas de la sabana de Bogotá. Aquí te contamos qué son y cómo sembrarlas. Una iniciativa hermana de Kindo.",
  // Enlaces de la navegación (texto + ancla). Editar aquí, no en render.js.
  nav: [
    { texto: "Semillas", ancla: "#semillas" },
    { texto: "Por qué", ancla: "#filosofia" },
    { texto: "Aliados", ancla: "#aliados" },
  ],
};

// ── HERO ───────────────────────────────────────────────────────────────────
export const hero = {
  titulo: "Tienes un paquete con futuros en tus manos",
  parrafo:
    "Si estás leyendo esto, tienes en tus manos un paquetico con varias semillas, nativas de la sabana de Bogotá. " +
    "Plantas muy antiguas y que este suelo " +
    "reconoce. Sembrarlas es devolverle algo a la tierra que te sostiene :)",
  ctaPrincipal: { texto: "Cómo sembrarlas", ancla: "#semillas" },
  ctaSecundario: { texto: "Conoce las semillas", ancla: "#semillas" },
  // Espacio reservado a la derecha del hero para una foto o gif del paquete
  // con el QR abriéndose. Pon la ruta en "src" (p. ej. "/hero-paquete.gif").
  // Para ocultar la columna por completo, deja media en null.
  media: {
    src: null,
    alt: "El sobre de semillas abriéndose para revelar lo que hay dentro",
    nota: "foto o gif del paquete + QR",
  },
};

// ── SEMILLAS ─────────────────────────────────────────────────────────────
// Cada ficha se trata como una etiqueta de herbario / sobre de semillas, y
// ahora carga lo suyo: dos fotos (la semilla y cómo se ve al germinar) y sus
// PROPIOS pasos y cuidados.
//
// FOTOS: pon los archivos en /public/semillas/ y escribe la ruta en "src"
// (p. ej. "/semillas/chicala-semilla.jpg"). Mientras "src" sea null, la ficha
// muestra un marco "pendiente" para que veas el espacio reservado.
//
// ⚠️ Los datos botánicos (pasos, cuidados, tiempos) son PLACEHOLDERS
// razonables. Valídalos con el banco de semillas antes de publicar.

// Textos de la sección (encabezado) + etiquetas que se repiten en CADA ficha.
// Al vivir aquí, otra ciudad puede traducir/adaptar toda la copia sin tocar
// el marcado.
export const semillasSeccion = {
  eyebrow: "en tu sobre",
  titulo: "Lo que llevas contigo",
  intro:
    "Una mezcla especial, curada por bancos de semillas de la sabana. " +
    "Cada una cuenta una historia. Y estas son las que podrías tener en tus manos:",
  etiquetas: {
    fotoSemilla: "la semilla",
    fotoGerminado: "al germinar",
    fotoPendiente: "foto pendiente",
    guiaCta: "Cómo sembrarla y cuidarla",
    guiaEyebrow: "cómo sembrarla",
    pasos: "Paso a paso",
    cuidados: "Cuidados",
  },
};

export const semillas = [
  {
    id: "chicala",
    comun: "Chicalá",
    cientifico: "Tecoma stans",
    familia: "Bignoniaceae",
    germina: "2 a 4 semanas",
    porte: "Árbol pequeño · 4–6 m",
    descripcion:
      "Pequeño árbol de flores amarillas en racimo. Atrae abejas y colibríes; " +
      "florece buena parte del año en la sabana.",
    fotos: {
      semilla: { src: null, alt: "Semilla de chicalá" },
      germinado: { src: null, alt: "Plántula de chicalá con sus primeras hojas" },
    },
    pasos: [
      "Remoja la semilla unas horas en agua a temperatura ambiente.",
      "Siémbrala superficial, a 2–3 mm, en tierra suelta.",
      "Mantenla a plena luz y con la tierra siempre húmeda.",
      "Trasplanta cuando tenga 3 o 4 hojas verdaderas.",
    ],
    cuidados: [
      "Sol directo varias horas al día.",
      "Riego moderado; nunca encharcar.",
      "Ya crecida, resiste bien la sequía.",
    ],
  },
  {
    id: "sietecueros",
    comun: "Sietecueros",
    cientifico: "Tibouchina lepidota",
    familia: "Melastomataceae",
    germina: "3 a 6 semanas",
    porte: "Árbol · 6–12 m",
    descripcion:
      "El de las flores moradas que tiñen los cerros de Bogotá. Su corteza " +
      "se desprende en capas, de ahí el nombre.",
    fotos: {
      semilla: { src: null, alt: "Semilla de sietecueros" },
      germinado: { src: null, alt: "Plántula de sietecueros recién brotada" },
    },
    pasos: [
      "No la remojes: la semilla es muy fina.",
      "Espárcela sobre la tierra y presiona suave, sin enterrar.",
      "Cubre la matera con plástico para guardar la humedad.",
      "Destapa al brotar y dale luz indirecta.",
    ],
    cuidados: [
      "Media sombra mientras es pequeña.",
      "Tierra siempre húmeda, nunca seca.",
      "Protégela del viento fuerte.",
    ],
  },
  {
    id: "arrayan",
    comun: "Arrayán",
    cientifico: "Myrcianthes leucoxyla",
    familia: "Myrtaceae",
    germina: "4 a 8 semanas",
    porte: "Árbol · 6–10 m",
    descripcion:
      "Árbol sagrado para los muiscas, de hoja perenne y madera densa. " +
      "Da frutos pequeños que comen las aves.",
    fotos: {
      semilla: { src: null, alt: "Semilla de arrayán" },
      germinado: { src: null, alt: "Plántula de arrayán con sus primeras hojas" },
    },
    pasos: [
      "Siembra la semilla fresca, a 1 cm de profundidad.",
      "Usa tierra rica y bien drenada.",
      "Mantén húmedo y en media sombra.",
      "Ten paciencia: germina despacio.",
    ],
    cuidados: [
      "Crece lento; no lo apresures.",
      "Riego regular durante el primer año.",
      "Tolera bien el frío de la sabana.",
    ],
  },
  {
    id: "mortino",
    comun: "Mortiño",
    cientifico: "Vaccinium meridionale",
    familia: "Ericaceae",
    germina: "4 a 10 semanas",
    porte: "Arbusto · 1–3 m",
    descripcion:
      "Pariente andino del arándano. Da frutos morados comestibles; crece " +
      "en suelos ácidos del altiplano y el páramo.",
    fotos: {
      semilla: { src: null, alt: "Semilla de mortiño" },
      germinado: { src: null, alt: "Plántula de mortiño recién brotada" },
    },
    pasos: [
      "Siembra la semilla, diminuta, sobre la superficie.",
      "Usa sustrato ácido (con turba u hojarasca).",
      "Mantén húmedo y en media sombra.",
      "Sé muy paciente: puede tardar semanas.",
    ],
    cuidados: [
      "Prefiere suelos ácidos, como los del páramo.",
      "Humedad constante, sin encharcar.",
      "Media sombra y sol suave.",
    ],
  },
];

// ── FILOSOFÍA ───────────────────────────────────────────────────────────
export const filosofia = {
  eyebrow: "por qué semillas",
  cita: "Para construir un mejor futuro, tenemos que poder sentirlo primero.",
  parrafos: [
    "Las redes nos enseñaron a creer que el futuro es un lugar oscuro e " +
      "inamovible. Pero la realidad también está llena de gente, barrios y " +
      "colectivos construyendo futuros más amables, más cerca de la naturaleza.",
    "Sembrar una planta nativa es una forma pequeña y terca de imaginar ese " +
      "futuro con las manos. No es un gesto simbólico: es sabana que vuelve, " +
      "es sombra, es comida para las aves, es un barrio un poco más vivo.",
    "Te llegó en Halloween casi como un truco. El trato es este: cuídala, y " +
      "pásale la voz a alguien más.",
  ],
};

// ── ALIADOS ─────────────────────────────────────────────────────────────
export const aliadosSeccion = {
  eyebrow: "no lo hacemos solos",
  titulo: "Quienes siembran con nosotros",
};

export const aliados = [
  { nombre: "Plant-for-the-Planet Colombia", logo: null, url: "#" },
  { nombre: "Bancos de semillas locales", logo: null, url: "#" },
  { nombre: "Organizaciones de barrio", logo: null, url: "#" },
];

// ── COMPARTIR / REDES ────────────────────────────────────────────────────
export const cierre = {
  titulo: "El trato: pásalo",
  texto:
    "Si sembraste, ya eres parte. Cuéntalo, etiquétanos, o pásale semillas a " +
    "un vecino el próximo octubre.",
  redes: [
    { nombre: "Instagram", url: "#" },
    { nombre: "WhatsApp (comunidad Kindo)", url: "#" },
  ],
};
