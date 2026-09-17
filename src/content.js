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
    "Recibiste semillas nativas de la sabana de Bogotá. Aquí te contamos qué son y cómo sembrarlas.",
  // Enlaces de la navegación (texto + ancla). Editar aquí, no en render.js.
  // Van con "/" al inicio para que funcionen también desde /custodios.html.
  nav: [
    { texto: "Semillas", ancla: "/#semillas" },
    { texto: "Por qué", ancla: "/#filosofia" },
    { texto: "Aliados", ancla: "/#aliados" },
    { texto: "Custodios", ancla: "/custodios.html" },
  ],
};

// ── HERO ───────────────────────────────────────────────────────────────────
export const hero = {
  // Título con una palabra que rota en carrusel:
  // "{tituloAntes} {tituloRota[i]} {tituloDespues}".
  // Si tituloRota tiene una sola palabra (o el usuario no quiere animación),
  // el título queda fijo.
  tituloAntes: "Tienes un paquete con",
  tituloRota: ["futuros", "semillas", "esperanza"],
  tituloDespues: "en tus manos",
  // Hashtags bajo el título (cada uno en su línea). Deja el arreglo vacío
  // para ocultarlos.
  hashtags: ["#SembrandoFuturos", "#SembramosFuturos"],
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

// ── EL EVENTO / LA MOVIDA ────────────────────────────────────────────────
// Qué es esto, dónde ocurre y cuál es la invitación. Va justo tras el hero:
// primero se entiende la movida, luego el "qué hago".
export const evento = {
  titulo: "¿Qué es Sembrando Futuros?",
  intro:
    "Somos un evento de educación, juego y acción colectiva alrededor de las semillas nativas de la Sabana de Bogotá. " +
    "Sembramos esperanza y futuros posibles, una semilla y un encuentro a la vez. " +
    "La invitación es simple: Siembra, Divirtiete, Comparte ",
  tarjetas: [
    {
      k: "Dónde",
      titulo: "Barrios de Bogotá",
      texto:
        "De puerta en puerta, con vecinos y en nuestros barrios. La sabana vuelve " +
        "balcón por balcón, parque por parque.",
    },
    {
      k: "Cuándo",
      titulo: "Octubre",
      texto:
        "Época de fiestas y disfraces: " + "Si compartimos dulces... " +
        "¿por qué no también semillas?",
    },
    {
      k: "Con quién",
      titulo: "¡Tus Comunidades!",
      texto:
        "Bancos de semillas, organizaciones de barrio y cualquiera que quiera " +
        "sembrar. Una vez siembras, ya eres parte :)",
    },
  ],
};

// ── ¿Y AHORA QUÉ? (los 3 pasos) ──────────────────────────────────────────
// La respuesta rápida a "¿qué hago con esto?", antes del detalle botánico.
export const queHago = {
  titulo: "¿Y ahora qué hago?",
  pasos: [
    {
      titulo: "Ábrelo",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do " +
        "eiusmod tempor incididunt ut labore.",
    },
    {
      titulo: "Siémbralas",
      texto:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
        "nisi ut aliquip ex ea commodo.",
    },
    {
      titulo: "Comparte",
      texto:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse " +
        "cillum dolore eu fugiat nulla pariatur.",
    },
  ],
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

// Puente al final de "Lo que llevas contigo" → página de custodios.
export const puenteCustodios = {
  // El texto usa [[palabra]] para marcar los resaltados de marcador.
  texto:
    "Estas semillas tienen un [[origen]] y una [[historia]], conoce a quienes las custodian",
  cta: "Conocer a los custodios →",
  url: "/custodios.html",
  foto: { src: null, alt: "Retrato del custodio de semillas" },
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

// ── FILOSOFÍA / MANIFIESTO ───────────────────────────────────────────────
// Corto y punzante en la página (cita + 3 beats); el manifiesto completo se
// abre en un modal para quien quiera ahondar.
// ⚠️ Manifiesto en LOREM IPSUM — placeholder a la espera del copy final.
export const filosofia = {
  cita: "¿Por que lo hacemos?",
  beats: [
    {
      titulo: "Lorem ipsum",
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      titulo: "Dolor sit amet",
      texto: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
      titulo: "Consectetur elit",
      texto: "Ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
  ],
  ctaCompleto: "Leer el manifiesto completo",
  manifiestoTitulo: "Lorem ipsum dolor",
  completo: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
      "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " +
      "veniam, quis nostrud exercitation ullamco laboris.",
    "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in " +
      "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla " +
      "pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui " +
      "officia deserunt mollit anim id est laborum.",
  ],
};
// proyecto de pedagogía y acción colectiva alrededor de las semillas nativas de la sabana de Bogotá

// ── COLECTIVIDAD ─────────────────────────────────────────────────────────
// Enmarca que esto es más grande que una web: la puerta a una movida
// colectiva, con el teaser del mapa (v2).
export const colectivo = {
  titulo: "Somos parte de algo más grande",
  texto:
    "Es un evento de educación, juego y acción colectiva alrededor de las semillas nativas de la Sabana de Bogotá " +
    "sembrando el mismo futuro, cada quien en su barrio. Cuando siembras, te sumas.",
  teaser:
    "Pronto: un mapa para marcar dónde sembraste y ver la sabana volver por todo Bogotá.",
};

// ── ALIADOS ─────────────────────────────────────────────────────────────
// ── SÚMATE / REGISTRO ────────────────────────────────────────────────────
// Captura nombre + correo para avisar los resultados del evento (y el mapa v2).
//
// CÓMO CONECTARLO (sin backend): pega en `endpoint` la URL de un receptor
// simple que te entregue un CSV — Formspree, Web3Forms o un Google Form.
//   · Web3Forms: endpoint "https://api.web3forms.com/submit" + tu accessKey.
//   · Formspree: endpoint "https://formspree.io/f/xxxxxxx" (accessKey vacío).
// Mientras `endpoint` esté vacío, el form corre en MODO DEMO (no envía nada,
// solo muestra el estado de éxito) para poder probar el diseño.
//
// TODO(migración): cuando crezca, migrar a MailerLite (formulario embebido:
// captura + envío + bajas + consentimiento en una sola plataforma).
export const registro = {
  titulo: "Súmate y entérate cómo germinó",
  intro:
    "Déjanos tu nombre y correo: te contamos los resultados de la siembra y " +
    "te avisamos cuando esté el mapa. Sin spam, y te puedes salir cuando quieras.",
  campos: {
    nombre: "Tu nombre",
    email: "Tu correo",
    barrio: "Tu barrio (opcional)",
  },
  consentimiento:
    "Acepto que me escriban para contarme sobre Sembrando Futuros.",
  avisoPrivacidad: { texto: "Cómo cuidamos tus datos", url: "#" },
  boton: "Quiero enterarme",
  enviando: "Enviando…",
  exito: "¡Listo! Te escribiremos pronto. 🌱",
  error: "Uy, algo falló. Inténtalo de nuevo en un momento.",
  endpoint: "", // ← pega aquí el endpoint del receptor (ver nota de arriba)
  accessKey: "", // ← solo Web3Forms
};

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
// ⚠️ SECCIÓN RETIRADA de la página (la banda "El trato: pásalo" se eliminó;
// la página ahora cierra con colectividad + súmate). Se conserva el copy y el
// link de Instagram por si se reubican después.
export const cierre = {
  titulo: "El trato: pásalo",
  texto:
    "Si sembraste, ya eres parte. Cuéntalo, etiquétanos, o pásale semillas a " +
    "un vecino el próximo octubre.",
  redes: [
    { nombre: "Instagram", url: "#" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA /custodios — Custodios y custodias de semillas
//
// Formato featuring, arco emocional ALTAR (silencio, testimonio) → VERBENA
// (fiesta) al cierre. ⚠️ Copy en LOREM IPSUM a la espera del texto final.
// En los textos, [[palabra]] marca resaltado de marcador.
//
// ⚠️ Antes de publicar EN VIVO: reenviar el resultado final al custodio y
// esperar su aprobación (consentimiento re-confirmado sobre lo publicado).
// ═══════════════════════════════════════════════════════════════════════════
export const custodiosPagina = {
  tituloPagina: "custodios de semillas — sembrando futuros",
  descripcion:
    "Las semillas de tu sobre tienen un origen y una historia. Conoce a quienes las custodian.",

  // 1 · Featuring: el video del custodio (~1 min) + su cita textual.
  // VIDEO: pon el mp4 en /public/custodios/ y la ruta en "src"
  // (p. ej. "/custodios/abuelo.mp4"), con su "poster" (imagen de portada).
  // Mientras src sea null se muestra un marco "pendiente".
  featuring: {
    marca: "custodio de semillas · sabana de Bogotá",
    video: { src: null, poster: null, nota: "video ≈ 1 min · con subtítulos" },
    cita: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.",
    nombre: "Lorem Ipsum Dolor",
    rol: "custodio de semillas · Lorem, Cundinamarca",
  },

  // 2 · Qué es custodiar — notas sueltas (3 máx).
  queEs: {
    titulo: "¿Qué es [[custodiar]] semillas?",
    notas: [
      { titulo: "Lorem ipsum", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod." },
      { titulo: "Dolor sit", texto: "Sed do eiusmod tempor incididunt ut labore." },
      { titulo: "Consectetur amet", texto: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
    ],
  },

  // 3 · Mesa de fotos (polaroids). FOTOS: /public/custodios/ y ruta en "src".
  fotos: {
    titulo: "Lorem ipsum [[dolor]]",
    items: [
      { src: null, alt: "Lorem ipsum", pie: "lorem ipsum, 2026" },
      { src: null, alt: "Dolor sit", pie: "dolor sit" },
      { src: null, alt: "Consectetur", pie: "consectetur elit" },
      { src: null, alt: "Eiusmod", pie: "eiusmod tempor" },
    ],
  },

  // 4 · Bancos de semillas.
  bancos: {
    titulo: "De la mano del custodio a [[tu sobre]]",
    parrafos: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },

  // 5 · Slots para más custodios (2–3 máx). Cuando llegue el siguiente,
  // este arreglo se convierte en featurings completos.
  proximos: ["Custodio/a 2 · próximamente", "Custodio/a 3 · próximamente"],

  // 6 · Cierre en VERBENA — el círculo se cierra: quien siembra, custodia.
  cierre: {
    titulo: "Al sembrar, tú también [[custodias]]",
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    ctaPrincipal: { texto: "Cómo sembrarlas", url: "/#semillas" },
    ctaSecundario: { texto: "Súmate", url: "/#sumate" },
  },
};
