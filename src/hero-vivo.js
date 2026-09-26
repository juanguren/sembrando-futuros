// ─────────────────────────────────────────────────────────────────────────
//  HERO VIVO · confeti de semillas + palabra rotativa
//
//  Las dos cosas van juntas porque comparten una medición: el ancho de la
//  palabra más larga. Los huecos del confeti se calculan con ESA palabra
//  puesta (el peor caso), de modo que el confeti nunca estorba al texto y
//  —lo importante— no hay que volver a sembrarlo cuando la palabra cambia.
//  Así cada pieza vuela ininterrumpida: un loop continuo, sin reinicios.
//
//  El confeti se colorea con las variables del tema (no con colores fijos),
//  así funciona en los dos temas visuales sin regenerarse.
//
//  Cómo está organizado (núcleo puro + cáscara que toca el DOM):
//   1 · Geometría             funciones puras, sin DOM
//   2 · Leer el hero          leerEscena(): el hero convertido en datos
//   3 · Núcleo del confeti    detectarHuecos → repartirCupos → colocarPiezas
//   4 · Pintar                pintarConfeti(): los datos convertidos en <span>
//   5 · Palabra rotativa
//   6 · Entrada pública       initHeroVivo()
//
//  Todo lo afinable (cantidades, tiempos, márgenes) vive en
//  hero-vivo.ajustes.js. Aquí solo hay lógica.
// ─────────────────────────────────────────────────────────────────────────
import {
  BRISA, VUELO, PALABRA, ESPERA_TRAS_RESIZE, FORMAS, TONOS,
  CLASES, SELECTORES, TEXTOS, TIPOS_DE_HUECO, GEOMETRIA,
} from "./hero-vivo.ajustes.js";
import { crearAzar, alAzarEntre, alAzarDe } from "./azar.js";

// ═══ 1 · Geometría ════════════════════════════════════════════════════════
// (El azar con semilla vive en azar.js: lo comparte con la fogata.)

const seSolapan = (a, b) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const cajaDe = (pieza) => ({
  x1: pieza.x, y1: pieza.y, x2: pieza.x + pieza.tamano, y2: pieza.y + pieza.tamano,
});

// Rectángulo de pantalla → coordenadas del hero, con un margen de respeto.
const relativoA = (cajaHero) => (caja, margen = 0) => ({
  x1: caja.left - cajaHero.left - margen,
  y1: caja.top - cajaHero.top - margen,
  x2: caja.right - cajaHero.left + margen,
  y2: caja.bottom - cajaHero.top + margen,
});

// ═══ 2 · Leer el hero ═════════════════════════════════════════════════════

// Rects ceñidos a los glifos, renglón a renglón. Ojo: Range.selectNodeContents()
// sobre un contenedor con hijos display:block devuelve TAMBIÉN las cajas de
// bloque (ancho completo), lo que tapaba huecos reales. Por eso se recorre
// nodo de texto por nodo de texto.
function rectsDeTexto(elemento) {
  const rects = [];
  const recorrido = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
  let nodo;
  while ((nodo = recorrido.nextNode())) {
    if (!nodo.nodeValue.trim()) continue;
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    rects.push(...rango.getClientRects());
  }
  return rects;
}

// El hero convertido en datos: su tamaño, las líneas de texto que el confeti
// debe esquivar y el cuadro del paquete. De aquí en adelante todo es
// geometría pura, sin DOM.
function leerEscena(hero) {
  const cajaHero = hero.getBoundingClientRect();
  const relativo = relativoA(cajaHero);
  const lineas = [];

  for (const texto of TEXTOS) {
    for (const elemento of hero.querySelectorAll(texto.selector)) {
      const cajas = texto.medir === "caja"
        ? [elemento.getBoundingClientRect()]
        : rectsDeTexto(elemento);
      for (const caja of cajas) {
        if (caja.width < GEOMETRIA.rectoMinimo || caja.height < GEOMETRIA.rectoMinimo) continue;
        lineas.push({
          ...relativo(caja, texto.margen),
          pesoDerecha: texto.pesoDerecha,
          destacado: texto.destacado,
        });
      }
    }
  }

  const media = hero.querySelector(SELECTORES.media);
  return {
    ancho: cajaHero.width,
    alto: cajaHero.height,
    lineas,
    media: media ? relativo(media.getBoundingClientRect()) : null,
  };
}

// ═══ 3 · Núcleo del confeti (puro) ════════════════════════════════════════

// Un hueco = un rectángulo + el comportamiento que declara su tipo.
const crearHueco = (tipo, rect, extra = {}) => ({ tipo, ...TIPOS_DE_HUECO[tipo], ...rect, ...extra });

const hayTextoALaDerecha = (linea, lineas) =>
  lineas.some((otra) => otra !== linea && otra.x1 > linea.x2 && otra.y2 > linea.y1 && otra.y1 < linea.y2);

const invadenBanda = (lineas, y1, y2, holgura) =>
  lineas.some((linea) => linea.y1 < y2 - holgura && linea.y2 > y1 + holgura);

// Detecta el espacio negativo del hero en vez de tirar piezas al azar (tirar
// al azar las amontonaba donde más sitio sobraba: abajo y a la derecha).
function detectarHuecos({ ancho, alto, lineas, media }) {
  const { huecoMinimo, alturaMinimaLinea, respiro, borde, tolerancia } = GEOMETRIA;
  const huecos = [];

  // 1 · A la derecha de cada línea corta (el costado de los hashtags vive aquí)
  for (const linea of lineas) {
    const libre = ancho - linea.x2 - respiro;
    if (libre < huecoMinimo || linea.y2 - linea.y1 < alturaMinimaLinea) continue;
    if (hayTextoALaDerecha(linea, lineas)) continue;
    huecos.push(crearHueco("derecha",
      { x1: linea.x2 + respiro, y1: linea.y1, x2: ancho - borde, y2: linea.y2 },
      { peso: linea.pesoDerecha ?? TIPOS_DE_HUECO.derecha.peso, destacado: linea.destacado }));
  }

  // 2 · Bandas libres entre bloques consecutivos
  const porAltura = [...lineas].sort((a, b) => a.y1 - b.y1);
  for (let i = 0; i < porAltura.length - 1; i++) {
    const y1 = porAltura[i].y2, y2 = porAltura[i + 1].y1;
    if (y2 - y1 < huecoMinimo || invadenBanda(lineas, y1, y2, tolerancia)) continue;
    huecos.push(crearHueco("entre", { x1: borde, y1, x2: ancho - borde, y2 }));
  }

  // 3 · Márgenes de arriba y de abajo
  if (lineas.length) {
    const techo = Math.min(...lineas.map((linea) => linea.y1));
    const piso = Math.max(...lineas.map((linea) => linea.y2));
    if (techo >= huecoMinimo) {
      huecos.push(crearHueco("margenSuperior", { x1: borde, y1: borde, x2: ancho - borde, y2: techo }));
    }
    if (alto - piso >= huecoMinimo) {
      huecos.push(crearHueco("margenInferior", { x1: borde, y1: piso, x2: ancho - borde, y2: alto - borde }));
    }
  }

  // 4 · Sobre el paquete: unas piezas van POR DELANTE de la foto (profundidad)
  if (media) huecos.push(crearHueco("sobre", media));

  return huecos;
}

// Cuántas piezas le tocan a cada hueco. Se pondera por RAÍZ del área: con el
// área a secas, el cuadro del paquete (~122.000 px²) aplasta al costado de
// los hashtags (~6.000 px²) y ese hueco queda vacío.
function repartirCupos(huecos, brisa) {
  const pesos = huecos.map((hueco) => {
    const area = Math.max(0, hueco.x2 - hueco.x1) * Math.max(0, hueco.y2 - hueco.y1);
    const peso = Math.sqrt(area) * hueco.peso * (brisa.sesgoPorTipo[hueco.tipo] ?? 1);
    return hueco.destacado ? peso * brisa.prioridadDestacados : peso;
  });
  const pesoTotal = pesos.reduce((suma, peso) => suma + peso, 0) || 1;

  return huecos.map((hueco, i) => {
    const proporcional = Math.round(brisa.cantidad * pesos[i] / pesoTotal);
    const cupo = hueco.destacado ? Math.max(proporcional, brisa.minimoJuntoADestacados) : proporcional;
    return { hueco, cupo };
  });
}

const tocaTexto = (pieza, lineas) => lineas.some((linea) => seSolapan(cajaDe(pieza), linea));
const demasiadoCerca = (pieza, otras, factor) =>
  otras.some((otra) => distancia(otra, pieza) < (otra.tamano + pieza.tamano) * factor);

// Cómo se ve y cómo se mueve una pieza. En un carnaval el confeti también
// vuela: las piezas de la zona alta y las que van sobre el paquete recorren
// más y en diagonal; las encajadas entre líneas apenas flotan.
// (El orden de las llamadas a `azar` es parte del resultado: cambiarlo
// cambia toda la composición.)
function aspectoDe(hueco, altoHero, azar) {
  const giro = Math.round(alAzarEntre(azar, VUELO.giroInicial));
  const vuela = hueco.vuela || hueco.y1 < altoHero * GEOMETRIA.zonaAlta;
  const rango = vuela ? VUELO.alto : VUELO.suave;
  return {
    giro,
    dx: alAzarEntre(azar, rango.dx),
    dy: -alAzarEntre(azar, rango.dy),
    dr: Math.round(alAzarEntre(azar, rango.giro)),
    opacidad: alAzarEntre(azar, VUELO.opacidad),
    forma: alAzarDe(azar, FORMAS),
    tono: alAzarDe(azar, TONOS),
    duracion: alAzarEntre(azar, VUELO.duracion),
    desfase: -alAzarEntre(azar, VUELO.desfase),
    capa: hueco.capa,
  };
}

// Llena cada hueco con su cupo sin pisar el texto ni amontonar piezas.
function colocarPiezas(escena, cupos, brisa, azar) {
  const { holguraMinima, maxIntentos } = GEOMETRIA;
  const rangoTamano = [brisa.tamanoMin, brisa.tamanoMax];
  const piezas = [];

  for (const { hueco, cupo } of cupos) {
    let faltan = cupo;
    let intentos = 0;
    while (faltan > 0 && intentos < maxIntentos) {
      intentos++;
      const tamano = Math.round(alAzarEntre(azar, rangoTamano));
      const anchoLibre = hueco.x2 - hueco.x1 - tamano;
      const altoLibre = hueco.y2 - hueco.y1 - tamano;
      if (anchoLibre < holguraMinima || altoLibre < 0) break; // no cabe: el hueco se da por lleno

      const pieza = { x: hueco.x1 + azar() * anchoLibre, y: hueco.y1 + azar() * altoLibre, tamano };
      if (hueco.esquivaTexto && tocaTexto(pieza, escena.lineas)) continue;
      if (demasiadoCerca(pieza, piezas, hueco.separacion)) continue;

      piezas.push({ ...pieza, ...aspectoDe(hueco, escena.alto, azar) });
      faltan--;
    }
  }
  return piezas;
}

// ═══ 4 · Pintar ═══════════════════════════════════════════════════════════

function crearElemento(pieza) {
  const el = document.createElement("span");
  el.className = `${CLASES.confeti} ${CLASES.confeti}--${pieza.forma} ${CLASES.confeti}--${pieza.tono}`;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    `left:${pieza.x.toFixed(0)}px; top:${pieza.y.toFixed(0)}px;` +
    ` width:${pieza.tamano}px; height:${pieza.tamano}px;` +
    (pieza.capa ? ` z-index:${pieza.capa};` : "") +
    ` --rot:${pieza.giro}deg; transform:rotate(${pieza.giro}deg);` +
    ` --dx:${pieza.dx.toFixed(1)}px; --dy:${pieza.dy.toFixed(1)}px; --dr:${pieza.dr}deg;` +
    ` --dur:${pieza.duracion.toFixed(1)}s; --delay:${pieza.desfase.toFixed(1)}s;`;
  return el;
}

// Las piezas entran con un fundido (transición CSS de opacity), todas en el
// mismo frame.
function pintarConfeti(hero, piezas) {
  const elementos = piezas.map(crearElemento);
  hero.append(...elementos);
  requestAnimationFrame(() => {
    elementos.forEach((el, i) => { el.style.opacity = piezas[i].opacidad.toFixed(2); });
  });
}

// Ejecuta fn() con la palabra MÁS LARGA puesta → la escena del peor caso.
function conPalabraMasLarga(hero, medidas, fn) {
  const rota = hero.querySelector(SELECTORES.palabra);
  if (!rota || !medidas?.anchoMax) return fn();
  const anchoPrevio = rota.style.width, transicionPrevia = rota.style.transition;
  rota.style.transition = "none";
  rota.style.width = medidas.anchoMax + "px";
  void rota.offsetWidth;
  const resultado = fn();
  rota.style.width = anchoPrevio;
  void rota.offsetWidth;
  rota.style.transition = transicionPrevia;
  return resultado;
}

// El proceso completo, de arriba abajo.
function sembrarConfeti(hero, medidas, brisa) {
  hero.querySelectorAll(SELECTORES.confeti).forEach((el) => el.remove());
  const escena = conPalabraMasLarga(hero, medidas, () => leerEscena(hero));
  const huecos = detectarHuecos(escena);
  if (!huecos.length || !escena.ancho) return;
  const cupos = repartirCupos(huecos, brisa);
  const piezas = colocarPiezas(escena, cupos, brisa, crearAzar(brisa.semilla));
  pintarConfeti(hero, piezas);
}

// ═══ 5 · Palabra rotativa ═════════════════════════════════════════════════

// Ancho de una palabra, medido en un clon invisible con los mismos estilos.
function medirAncho(rota, palabra) {
  const clon = rota.cloneNode(false);
  clon.style.cssText += "position:absolute;visibility:hidden;width:auto;transition:none;";
  const capsula = document.createElement("span");
  capsula.className = CLASES.capsula;
  capsula.textContent = palabra;
  clon.appendChild(capsula);
  rota.parentNode.appendChild(clon);
  const ancho = clon.getBoundingClientRect().width;
  clon.remove();
  return ancho;
}

// Mide todas las palabras de una vez: el ancho de cada una (para el cambio) y
// el de la más larga (para sembrar el confeti en el peor caso).
function medirPalabras(rota, palabras) {
  const anchos = palabras.map((palabra) => medirAncho(rota, palabra));
  return { anchos, anchoMax: Math.max(...anchos) };
}

// Cambio con UNA sola cápsula: se desvanece, cambia de texto mientras es
// invisible y vuelve a entrar. Nunca coexisten dos palabras: un crossfade de
// dos textos distintos se lee como duplicado, no como fundido.
function cambiarPalabra(rota, palabra, ancho) {
  const capsula = rota.querySelector(SELECTORES.capsula);
  if (!capsula) return;

  capsula.style.opacity = "0";
  capsula.style.transform = `translateY(-${PALABRA.recorrido})`;
  // el ancho fluye justo mientras la palabra está invisible: no se nota
  if (ancho != null) rota.style.width = ancho + "px";

  setTimeout(() => {
    capsula.style.transition = "none";
    capsula.textContent = palabra;
    capsula.style.transform = `translateY(${PALABRA.recorrido})`;
    void capsula.offsetWidth;
    capsula.style.transition = "";
    requestAnimationFrame(() => {
      capsula.style.opacity = "1";
      capsula.style.transform = "translateY(0)";
    });
  }, PALABRA.fundido);
}

// ═══ 6 · Entrada pública ══════════════════════════════════════════════════

export function initHeroVivo(palabras = []) {
  const hero = document.querySelector(SELECTORES.hero);
  if (!hero) return;
  const rota = hero.querySelector(SELECTORES.palabra);
  let medidas = null; // anchos de las palabras; se recalculan en cada resize
  let indice = 0;     // palabra visible ahora mismo

  const medirYSembrar = () => {
    if (rota && palabras.length) {
      medidas = medirPalabras(rota, palabras);
      rota.style.width = medidas.anchos[indice] + "px";
    }
    sembrarConfeti(hero, medidas, BRISA);
  };

  // Las fuentes primero: medir antes de que carguen da anchos equivocados.
  (document.fonts?.ready || Promise.resolve()).then(medirYSembrar);

  let espera;
  addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(medirYSembrar, ESPERA_TRAS_RESIZE);
  });

  const prefiereQuietud = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!prefiereQuietud && rota && palabras.length > 1) {
    setInterval(() => {
      indice = (indice + 1) % palabras.length;
      cambiarPalabra(rota, palabras[indice], medidas?.anchos[indice]);
      // A propósito, el confeti NO se vuelve a sembrar aquí: sus huecos ya
      // contemplan la palabra más larga, así que nada se reinicia.
    }, PALABRA.intervalo);
  }
}
