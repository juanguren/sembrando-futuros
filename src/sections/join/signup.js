// ─────────────────────────────────────────────────────────────────────────
//  REGISTRO · envío del formulario "Súmate"
//
//  POST al `registro.endpoint` (Formspree/Web3Forms/Google Form → CSV). Sin
//  endpoint configurado corre en modo demo (no envía, solo muestra éxito).
//  Lo usan la página principal y /custodios, que cierran con la misma banda
//  (colectividad + súmate). Los textos viven en content.js (`registro`).
// ─────────────────────────────────────────────────────────────────────────

export function initRegistro(registro) {
  const form = document.querySelector(".registro__form");
  if (!form) return;
  const estado = form.querySelector(".registro__estado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot: bot → se descarta en silencio
    if (!form.checkValidity()) return form.reportValidity();

    const datos = new FormData(form);
    datos.delete("website");
    if (registro.accessKey) datos.append("access_key", registro.accessKey);

    estado.className = "registro__estado";
    estado.textContent = registro.enviando;

    if (!registro.endpoint) {
      // Modo demo: sin receptor configurado todavía.
      estado.classList.add("is-ok");
      estado.textContent = registro.exito + " (demo: falta configurar el endpoint)";
      form.reset();
      return;
    }
    try {
      const res = await fetch(registro.endpoint, {
        method: "POST",
        body: datos,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      estado.classList.add("is-ok");
      estado.textContent = registro.exito;
      form.reset();
    } catch {
      estado.classList.add("is-error");
      estado.textContent = registro.error;
    }
  });
}
