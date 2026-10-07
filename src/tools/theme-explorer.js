// ═════════════════════════════════════════════════════════════════════════
//  SELECTOR DE TEMAS · herramienta de exploración (OCULTA)
//
//  Alterna el atributo data-tema en <html> para comparar en vivo los dos
//  temas (animista-futurista y solarpunk) contra el contenido real.
//
//  Los visitantes no lo ven: siempre tienen el tema por defecto. Aparece solo
//  en el dispositivo de quien abra el sitio con ?temas en la dirección (por
//  ejemplo, …/?temas) y se apaga con ?temas=no.
//
//  NO es parte final del sitio: es un aislado deliberado. Para quitarlo,
//  borra este archivo y sus imports en src/pages/ (y, si quieres, los bloques
//  :root[data-tema=...] de styles/themes.css).
//
//  Inyecta su propio CSS para no ensuciar los estilos del sitio.
// ═════════════════════════════════════════════════════════════════════════

// Solo se guarda lo que alguien elige. (La clave anterior, sf-tema-explorador,
// guardaba el tema por defecto en cada visita y dejaba a todos fijados en él.)
const CLAVE_TEMA = "sf-tema-elegido";
const CLAVE_VISIBLE = "sf-temas-visible";
const PARAMETRO = "temas";
const APAGADO = ["no", "0", "off"];

// Lee ?temas: "encender", "apagar" o null si no viene. Lo recuerda en este
// dispositivo y lo quita de la dirección, para no compartirlo sin querer al
// copiar el enlace.
function leerInterruptor() {
  const url = new URL(location.href);
  if (!url.searchParams.has(PARAMETRO)) return null;
  const orden = APAGADO.includes(url.searchParams.get(PARAMETRO)) ? "apagar" : "encender";
  try {
    if (orden === "encender") localStorage.setItem(CLAVE_VISIBLE, "1");
    else [CLAVE_VISIBLE, CLAVE_TEMA].forEach((clave) => localStorage.removeItem(clave));
  } catch {}
  url.searchParams.delete(PARAMETRO);
  history.replaceState(history.state, "", url);
  return orden;
}

function encendidoAntes() {
  try { return localStorage.getItem(CLAVE_VISIBLE) === "1"; } catch { return false; }
}

export function initTemaExplorador() {
  const orden = leerInterruptor();
  if (orden === "apagar" || (orden !== "encender" && !encendidoAntes())) return;

  const TEMAS = [
    { id: "fogata", nombre: "Animista-futurista" },
    { id: "jardin-llamas", nombre: "Solarpunk" },
  ];
  const DEFECTO = "fogata"; // coincide con data-tema en los .html

  const aplicar = (id, { guardar = false } = {}) => {
    if (id) document.documentElement.setAttribute("data-tema", id);
    else document.documentElement.removeAttribute("data-tema");
    if (guardar) try { localStorage.setItem(CLAVE_TEMA, id); } catch {}
    panel.querySelectorAll("button[data-tema-id]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.temaId === id));
    });
  };

  const estilo = document.createElement("style");
  estilo.textContent = `
    .tema-explorador {
      position: fixed; right: 1rem; bottom: 1rem; z-index: 200;
      display: flex; flex-direction: column; gap: 0.3rem;
      padding: 0.55rem; border-radius: 10px;
      background: rgba(20, 20, 20, 0.86); color: #fff;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
      font-family: system-ui, sans-serif; font-size: 0.8rem;
      max-width: calc(100vw - 2rem);
    }
    .tema-explorador__tit {
      font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
      opacity: 0.6; padding: 0 0.2rem 0.15rem; margin: 0;
    }
    .tema-explorador__grid { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .tema-explorador button {
      font: inherit; cursor: pointer; color: inherit;
      padding: 0.4rem 0.7rem; border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: transparent; transition: background 0.15s, border-color 0.15s;
    }
    .tema-explorador button:hover { background: rgba(255, 255, 255, 0.1); }
    .tema-explorador button[aria-pressed="true"] {
      background: #fff; color: #111; border-color: #fff; font-weight: 600;
    }
    .tema-explorador button:focus-visible {
      outline: 2px solid #7db1ff; outline-offset: 2px;
    }
  `;
  document.head.appendChild(estilo);

  const panel = document.createElement("div");
  panel.className = "tema-explorador";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "Explorar temas visuales");
  panel.innerHTML =
    `<p class="tema-explorador__tit">tema</p>` +
    `<div class="tema-explorador__grid">` +
    TEMAS.map(
      (t) =>
        `<button type="button" data-tema-id="${t.id}" aria-pressed="false">${t.nombre}</button>`
    ).join("") +
    `</div>`;
  document.body.appendChild(panel);

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tema-id]");
    if (btn) aplicar(btn.dataset.temaId, { guardar: true });
  });

  let inicial = "";
  try { inicial = localStorage.getItem(CLAVE_TEMA) || ""; } catch {}
  aplicar(TEMAS.some((t) => t.id === inicial) ? inicial : DEFECTO);
}
