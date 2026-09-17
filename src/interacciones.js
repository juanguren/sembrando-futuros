// ─────────────────────────────────────────────────────────────────────────
//  INTERACCIONES COMPARTIDAS
//
//  Comportamiento común a todas las páginas (index, custodios): menú móvil,
//  modales <dialog>, lightbox de imágenes y cierre con Escape.
//  Cada página lo activa llamando a initInteracciones() tras montar su HTML.
// ─────────────────────────────────────────────────────────────────────────

export function initInteracciones() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");

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
    // Abrir un modal (guía de semilla, manifiesto…)
    const abrir = e.target.closest("[data-modal]");
    if (abrir) {
      document.getElementById(abrir.dataset.modal)?.showModal();
      return;
    }
    // Ampliar una foto en el lightbox
    const foto = e.target.closest("[data-full]");
    if (foto && lightbox && lightboxImg) {
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
}
