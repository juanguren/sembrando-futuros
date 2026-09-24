// ─────────────────────────────────────────────────────────────────────────
//  HERO VIVO · confeti de semillas + palabra rotativa
//
//  Las dos cosas van juntas porque comparten una medición: el ancho de la
//  palabra más larga. Los huecos del confeti se calculan con ESA palabra
//  puesta (el peor caso), de modo que el confeti nunca estorba al texto y
//  —lo importante— no hay que volver a sembrarlo cuando la palabra cambia.
//  Así cada pieza vuela ininterrumpida: se siente un loop continuo, sin
//  reinicios bruscos.
//
//  El confeti se colorea con las variables del tema (no con colores fijos),
//  así funciona en las cuatro direcciones visuales sin regenerarse.
// ─────────────────────────────────────────────────────────────────────────

// RNG con semilla fija: el reparto es SIEMPRE el mismo. Un confeti aleatorio
// sería imposible de aprobar (cada carga, otra composición).
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FORMAS = ["semilla", "brote", "hoja", "punto"];
const TONOS = ["lima", "acento", "arcilla", "sabana"];

// Márgenes de respeto (px) alrededor de cada línea de texto.
const MARGENES = {
  ".hero__titulo": 12,
  ".hero__hashtags": 7,
  ".hero__parrafo": 6,
  ".hero__ctas a": 9,
};

// "Brisa": pocas piezas, muy repartidas, con acento en los huecos junto al
// texto (sobre todo el costado de los hashtags, que es puro espacio negativo).
const BRISA = {
  n: 19, min: 10, max: 20, semilla: 7,
  sesgo: { derecha: 1.8, entre: 1.2, margen: 1, sobre: 0.5 },
  hashtags: 4,      // multiplicador de prioridad para ese costado
  minHashtags: 4,   // piezas garantizadas junto a cada línea de hashtag
};

// Rects ceñidos a los glifos. Ojo: Range.selectNodeContents() sobre un
// contenedor con hijos display:block devuelve TAMBIÉN las cajas de bloque
// (ancho completo), lo que tapaba huecos reales. Por eso se recorre nodo de
// texto por nodo de texto.
function rectsDeTexto(el) {
  const out = [];
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    out.push(...[...r.getClientRects()].filter((c) => c.width > 1 && c.height > 1));
  }
  return out;
}

function ocupados(hero) {
  const hr = hero.getBoundingClientRect();
  const out = [];
  for (const [sel, m] of Object.entries(MARGENES)) {
    hero.querySelectorAll(sel).forEach((el) => {
      const rects = sel === ".hero__ctas a" ? [el.getBoundingClientRect()] : rectsDeTexto(el);
      rects.forEach((cr) => {
        if (cr.width < 2 || cr.height < 2) return;
        out.push({
          x1: cr.left - hr.left - m, y1: cr.top - hr.top - m,
          x2: cr.right - hr.left + m, y2: cr.bottom - hr.top + m, sel,
        });
      });
    });
  }
  return { rects: out, w: hr.width, h: hr.height };
}

// Detecta los huecos del espacio negativo en vez de tirar piezas al azar
// (tirar al azar las amontonaba donde más sitio sobraba).
function huecos(hero) {
  const { rects, w, h } = ocupados(hero);
  const gaps = [];
  const MIN = 22;

  // 1 · a la derecha de cada línea (el hueco junto a los hashtags vive aquí)
  rects.forEach((r) => {
    const libre = w - r.x2 - 4;
    if (libre >= MIN && r.y2 - r.y1 >= 14) {
      const choca = rects.some((o) => o !== r && o.x1 > r.x2 && o.y2 > r.y1 && o.y1 < r.y2);
      if (!choca) {
        gaps.push({
          x1: r.x2 + 4, y1: r.y1, x2: w - 2, y2: r.y2, tipo: "derecha",
          peso: r.sel === ".hero__titulo" ? 3 : 2, fuente: r.sel,
        });
      }
    }
  });

  // 2 · bandas libres entre bloques
  const orden = [...rects].sort((a, b) => a.y1 - b.y1);
  for (let i = 0; i < orden.length - 1; i++) {
    const y1 = orden[i].y2, y2 = orden[i + 1].y1;
    if (y2 - y1 >= MIN && !rects.some((o) => o.y1 < y2 - 2 && o.y2 > y1 + 2)) {
      gaps.push({ x1: 2, y1, x2: w - 2, y2, tipo: "entre", peso: 2 });
    }
  }

  // 3 · márgenes de arriba y abajo
  if (rects.length) {
    const top = Math.min(...rects.map((r) => r.y1));
    const bot = Math.max(...rects.map((r) => r.y2));
    if (top >= MIN) gaps.push({ x1: 2, y1: 2, x2: w - 2, y2: top, tipo: "margen", peso: 3 });
    if (h - bot >= MIN) gaps.push({ x1: 2, y1: bot, x2: w - 2, y2: h - 2, tipo: "margen", peso: 1 });
  }

  // 4 · sobre el paquete: unas piezas van POR DELANTE de la foto (profundidad)
  const media = hero.querySelector(".hero__media-marco");
  if (media) {
    const hr = hero.getBoundingClientRect();
    const mr = media.getBoundingClientRect();
    gaps.push({
      x1: mr.left - hr.left, y1: mr.top - hr.top,
      x2: mr.right - hr.left, y2: mr.bottom - hr.top, tipo: "sobre", peso: 2,
    });
  }

  return { gaps, w, h, rects };
}

// Ejecuta fn() con la palabra más larga puesta → huecos del peor caso.
function conPalabraLarga(hero, fn) {
  const rota = hero.querySelector("[data-rota]");
  if (!rota || !hero._anchoMax) return fn();
  const pw = rota.style.width, pt = rota.style.transition;
  rota.style.transition = "none";
  rota.style.width = hero._anchoMax + "px";
  void rota.offsetWidth;
  const r = fn();
  rota.style.width = pw;
  void rota.offsetWidth;
  rota.style.transition = pt;
  return r;
}

function sembrar(hero, cfg) {
  hero.querySelectorAll(".confeti").forEach((e) => e.remove());
  const { gaps, w, h, rects } = conPalabraLarga(hero, () => huecos(hero));
  if (!gaps.length || !w) return;
  const rand = mulberry32(cfg.semilla);
  const puestas = [];

  // Cupos por hueco. Se pondera por RAÍZ del área: si se usa el área a secas,
  // el cuadro del paquete (~122.000 px²) aplasta al hueco de los hashtags
  // (~6.000 px²) y ese costado queda vacío.
  const pond = gaps.map((g) => {
    const area = Math.max(0, g.x2 - g.x1) * Math.max(0, g.y2 - g.y1);
    let p = Math.sqrt(area) * g.peso * (cfg.sesgo[g.tipo] ?? 1);
    if (g.fuente === ".hero__hashtags") p *= cfg.hashtags ?? 3.5;
    return p;
  });
  const total = pond.reduce((a, b) => a + b, 0) || 1;

  gaps.forEach((g, i) => {
    let cupo = Math.round(cfg.n * pond[i] / total);
    if (g.fuente === ".hero__hashtags") cupo = Math.max(cupo, cfg.minHashtags ?? 3);
    let intentos = 0;
    while (cupo > 0 && intentos < 160) {
      intentos++;
      const s = Math.round(cfg.min + rand() * (cfg.max - cfg.min));
      const gw = g.x2 - g.x1 - s, gh = g.y2 - g.y1 - s;
      if (gw < 2 || gh < 0) break;
      const px = g.x1 + rand() * Math.max(2, gw);
      const py = g.y1 + rand() * Math.max(0, gh);
      const sobre = g.tipo === "sobre";
      if (!sobre && (rects.some((z) => px + s > z.x1 && px < z.x2 && py + s > z.y1 && py < z.y2)
          || puestas.some((q) => Math.hypot(q.x - px, q.y - py) < (q.s + s) * 0.5))) continue;
      if (sobre && puestas.some((q) => Math.hypot(q.x - px, q.y - py) < (q.s + s) * 0.75)) continue;
      puestas.push({ x: px, y: py, s });

      const rot = Math.round(-40 + rand() * 80);
      // En un carnaval el confeti también vuela: las piezas de los márgenes y
      // de la zona alta se desplazan más y en diagonal; las encajadas entre
      // líneas apenas flotan.
      const vuela = sobre || g.tipo === "margen" || g.y1 < h * 0.45;
      const dx = (vuela ? rand() * 16 - 8 : rand() * 6 - 3).toFixed(1);
      const dy = -(vuela ? 8 + rand() * 16 : 4 + rand() * 6).toFixed(1);
      const dr = Math.round(vuela ? 6 + rand() * 18 : 3 + rand() * 6);
      const op = (0.55 + rand() * 0.3).toFixed(2);

      const el = document.createElement("span");
      el.className = `confeti confeti--${FORMAS[Math.floor(rand() * FORMAS.length)]}` +
        ` confeti--${TONOS[Math.floor(rand() * TONOS.length)]}`;
      el.setAttribute("aria-hidden", "true");
      el.style.cssText =
        `left:${px.toFixed(0)}px; top:${py.toFixed(0)}px; width:${s}px; height:${s}px;` +
        (sobre ? "z-index:3;" : "") +
        `--rot:${rot}deg; transform:rotate(${rot}deg);` +
        `--dx:${dx}px; --dy:${dy}px; --dr:${dr}deg;` +
        `--dur:${(4.5 + rand() * 5).toFixed(1)}s; --delay:${(-rand() * 7).toFixed(1)}s;`;
      hero.appendChild(el);
      requestAnimationFrame(() => { el.style.opacity = op; });
      cupo--;
    }
  });
}

// Ancho de una palabra, medido en un clon invisible con los mismos estilos.
function medirAncho(rota, palabra) {
  const m = rota.cloneNode(false);
  m.style.cssText += "position:absolute;visibility:hidden;width:auto;transition:none;";
  const cap = document.createElement("span");
  cap.className = "hero__rota-cap";
  cap.textContent = palabra;
  m.appendChild(cap);
  rota.parentNode.appendChild(m);
  const w = m.getBoundingClientRect().width;
  m.remove();
  return w;
}

// Cambio de palabra con UNA sola cápsula: se desvanece, cambia de texto
// mientras es invisible y vuelve a entrar. Nunca coexisten dos palabras — un
// crossfade de dos textos distintos se lee como duplicado, no como fundido.
function cambiarPalabra(hero, palabras, idx) {
  const rota = hero.querySelector("[data-rota]");
  const cap = rota && rota.querySelector(".hero__rota-cap");
  if (!cap) return;

  cap.style.opacity = "0";
  cap.style.transform = "translateY(-0.22em)";
  // el ancho fluye justo mientras la palabra está invisible: no se nota
  rota.style.width = hero._anchos[idx] + "px";

  setTimeout(() => {
    cap.style.transition = "none";
    cap.textContent = palabras[idx];
    cap.style.transform = "translateY(0.22em)";
    void cap.offsetWidth;
    cap.style.transition = "";
    requestAnimationFrame(() => {
      cap.style.opacity = "1";
      cap.style.transform = "translateY(0)";
    });
  }, 380);
}

export function initHeroVivo(palabras = []) {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const preparar = () => {
    const rota = hero.querySelector("[data-rota]");
    if (rota && palabras.length) {
      hero._anchos = palabras.map((w) => medirAncho(rota, w));
      hero._anchoMax = Math.max(...hero._anchos);
      rota.style.width = hero._anchos[0] + "px";
    }
    sembrar(hero, BRISA);
  };

  // Las fuentes primero: medir antes de que carguen da anchos equivocados.
  (document.fonts?.ready || Promise.resolve()).then(preparar);

  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(preparar, 200); });

  const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!quieto && palabras.length > 1) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % palabras.length;
      cambiarPalabra(hero, palabras, i);
      // a propósito: el confeti NO se vuelve a sembrar. Sus huecos ya
      // contemplan la palabra más larga, así que nada se reinicia.
    }, 3400);
  }
}
