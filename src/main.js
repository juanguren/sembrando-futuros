import "./style.css";
import {
  sitio,
  hero,
  semillas,
  semillasSeccion,
  filosofia,
  aliados,
  aliadosSeccion,
  cierre,
} from "./content.js";
import {
  renderNav,
  renderHero,
  renderSemillas,
  renderFilosofia,
  renderAliados,
  renderCierre,
  renderLightbox,
} from "./render.js";

document.title = sitio.tituloPagina;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute("content", sitio.descripcion);

document.querySelector("#app").innerHTML = [
  renderNav(sitio),
  `<main>`,
  renderHero(hero),
  renderSemillas(semillas, semillasSeccion),
  renderFilosofia(filosofia),
  renderAliados(aliados, aliadosSeccion),
  `</main>`,
  renderCierre(cierre),
  renderLightbox(),
].join("");

// ── Interacciones: modales de guía + lightbox de imágenes ────────────────
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");

// Menú móvil: refleja abierto/cerrado en el botón (aria) y permite cerrarlo.
const navToggle = document.getElementById("nav-toggle");
const navBurger = document.querySelector(".nav__burger");
const reflejarMenu = () => {
  const abierto = !!navToggle?.checked;
  navBurger?.setAttribute("aria-expanded", String(abierto));
  navBurger?.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
};
// Abrir por el label dispara "change"; cerrar por JS no, así que se refleja allí.
navToggle?.addEventListener("change", reflejarMenu);
const cerrarMenu = () => {
  if (navToggle) {
    navToggle.checked = false;
    reflejarMenu();
  }
};

document.addEventListener("click", (e) => {
  // Al tocar un enlace del menú, ciérralo (si no, queda abierto tras navegar).
  if (e.target.closest(".nav__links a")) cerrarMenu();
  // Abrir modal de guía de una semilla
  const abrir = e.target.closest("[data-modal]");
  if (abrir) {
    document.getElementById(abrir.dataset.modal)?.showModal();
    return;
  }
  // Ampliar una foto en el lightbox
  const foto = e.target.closest("[data-full]");
  if (foto) {
    lightboxImg.src = foto.dataset.full;
    lightboxImg.alt = foto.dataset.alt || "";
    lightbox.showModal();
    return;
  }
  // Cerrar (botón × dentro de cualquier dialog)
  const cerrar = e.target.closest("[data-close]");
  if (cerrar) {
    cerrar.closest("dialog")?.close();
    return;
  }
  // Cerrar al hacer clic en el fondo oscuro del dialog
  if (e.target.tagName === "DIALOG") {
    e.target.close();
  }
});

// Escape cierra el menú móvil si está abierto.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarMenu();
});

// ═════════════════════════════════════════════════════════════════════════
//  SELECTOR DE TEMAS · herramienta de exploración (TEMPORAL)
//
//  Alterna el atributo data-tema en <html> para comparar en vivo las tres
//  direcciones visuales contra el contenido real. NO es parte final del
//  sitio: es un aislado deliberado. Para quitarlo, borra este bloque entero
//  (y, si quieres, los bloques :root[data-tema=...] de style.css).
//
//  Inyecta su propio CSS para no ensuciar style.css.
// ═════════════════════════════════════════════════════════════════════════
(() => {
  const TEMAS = [
    { id: "", nombre: "v1 · herbario" },
    { id: "noche", nombre: "Noche de velas" },
    { id: "oro", nombre: "Tejido de oro" },
    { id: "jardin", nombre: "Jardín vivo" },
  ];
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
  aplicar(TEMAS.some((t) => t.id === inicial) ? inicial : "");
})();
