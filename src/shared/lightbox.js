// ─────────────────────────────────────────────────────────────────────────
//  LIGHTBOX · el visor de fotos ampliadas
//
//  Lo abre shared/interactions.js; sus estilos están en styles/lightbox.css.
// ─────────────────────────────────────────────────────────────────────────

// Lightbox reutilizable para ampliar cualquier foto.
export function renderLightbox() {
  return `
    <dialog class="lightbox" id="lightbox" aria-label="Imagen ampliada">
      <button class="lightbox__cerrar" data-close aria-label="Cerrar">&times;</button>
      <img class="lightbox__img" src="" alt="" />
    </dialog>`;
}
