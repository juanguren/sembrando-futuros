// ═════════════════════════════════════════════════════════════════════════
//  SELECTOR DE TEMAS · herramienta de exploración (TEMPORAL)
//
//  Alterna el atributo data-tema en <html> para comparar en vivo los dos
//  temas (solarpunk y animista-futurista) contra el contenido real.
//  NO es parte final del sitio: es un aislado deliberado. Para quitarlo,
//  borra este archivo y sus imports en main.js / custodios.js (y, si quieres,
//  los bloques :root[data-tema=...] de style.css).
//
//  Inyecta su propio CSS para no ensuciar style.css.
// ═════════════════════════════════════════════════════════════════════════

export function initTemaExplorador() {
  const TEMAS = [
    { id: "jardin-llamas", nombre: "Solarpunk" },
    { id: "fogata", nombre: "Animista-futurista" },
  ];
  const DEFECTO = "jardin-llamas"; // coincide con data-tema en los .html
  const CLAVE = "sf-tema-explorador";

  const aplicar = (id) => {
    if (id) document.documentElement.setAttribute("data-tema", id);
    else document.documentElement.removeAttribute("data-tema");
    try { localStorage.setItem(CLAVE, id); } catch {}
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
    if (btn) aplicar(btn.dataset.temaId);
  });

  let inicial = "";
  try { inicial = localStorage.getItem(CLAVE) || ""; } catch {}
  aplicar(TEMAS.some((t) => t.id === inicial) ? inicial : DEFECTO);
}
