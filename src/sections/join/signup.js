// ─────────────────────────────────────────────────────────────────────────
//  REGISTRO · envío del formulario "Súmate" a MailerLite
//
//  Traduce el formulario al formato del formulario embebido de MailerLite y
//  lo envía a `registro.endpoint`. Sin endpoint corre en modo demo (no envía,
//  solo muestra éxito). Lo usan la página principal y /custodios, que cierran
//  con la misma banda (colectividad + súmate). Los textos viven en content.js
//  (`registro`); la guía, en docs/registro-mailerlite.md.
// ─────────────────────────────────────────────────────────────────────────

// Cómo se llama en MailerLite cada campo de nuestro formulario. Si un campo no
// existe en el formulario de MailerLite, MailerLite lo ignora sin error.
const CAMPOS_MAILERLITE = Object.freeze({
  nombre: "fields[name]",
  email: "fields[email]",
  barrio: "fields[barrio]",
});

function datosParaMailerLite(form) {
  const datos = new FormData();
  for (const [nuestro, deMailerLite] of Object.entries(CAMPOS_MAILERLITE)) {
    const campo = form.elements[nuestro];
    if (campo) datos.append(deMailerLite, campo.value.trim());
  }
  // Los dos campos ocultos que trae el código del formulario de MailerLite.
  datos.append("ml-submit", "1");
  datos.append("anticsrf", "true");
  return datos;
}

// MailerLite responde "200 OK" incluso cuando rechaza el registro (correo
// inválido, por ejemplo): el resultado real viene en el JSON, en `success`.
async function enviarAMailerLite(endpoint, datos) {
  const res = await fetch(endpoint, {
    method: "POST",
    body: datos,
    headers: { Accept: "application/json" },
  });
  const respuesta = await res.json();
  if (!res.ok || !respuesta.success) throw new Error("MailerLite rechazó el registro");
}

export function initRegistro(registro) {
  const form = document.querySelector(".registro__form");
  if (!form) return;
  const estado = form.querySelector(".registro__estado");
  const mostrar = (texto, clase) => {
    estado.className = "registro__estado";
    if (clase) estado.classList.add(clase);
    estado.textContent = texto;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot: bot → se descarta en silencio
    if (!form.checkValidity()) return form.reportValidity();

    if (!registro.endpoint) {
      // Modo demo: sin receptor configurado todavía.
      mostrar(registro.exito + " (demo: falta configurar el endpoint)", "is-ok");
      form.reset();
      return;
    }
    mostrar(registro.enviando);
    try {
      await enviarAMailerLite(registro.endpoint, datosParaMailerLite(form));
      mostrar(registro.exito, "is-ok");
      form.reset();
    } catch {
      mostrar(registro.error, "is-error");
    }
  });
}
