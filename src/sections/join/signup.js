// ─────────────────────────────────────────────────────────────────────────
//  REGISTRO · envío del formulario "Súmate" a MailerLite
//
//  Traduce el formulario al formato del formulario embebido de MailerLite y
//  lo envía a `registro.endpoint`. Sin endpoint corre en modo demo (no envía,
//  solo muestra éxito). El botón cuenta lo que pasa (sembrando → sembrado, o
//  error) y los avisos de campos incompletos salen siempre en español. Lo
//  usan la página principal y /custodios. Textos en content.js (`registro`),
//  tiempos en signup.settings.js, guía en docs/registro-mailerlite.md.
// ─────────────────────────────────────────────────────────────────────────

import { BOTON, BROTE } from "./signup.settings.js";

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

const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

// ── Avisos en español ─────────────────────────────────────────────────────
// El navegador escribe sus avisos ("Please fill out this field") en el idioma
// del teléfono; aquí se cambian por los de content.js (`registro.avisos`).
function avisoPara(campo, avisos) {
  if (campo.validity.typeMismatch) return avisos.emailInvalido;
  if (campo.validity.valueMissing) return avisos[campo.name] ?? "";
  return "";
}

function avisosEnEspanol(form, avisos) {
  // `invalid` no burbujea: se escucha en la fase de captura.
  form.addEventListener("invalid", (e) => e.target.setCustomValidity(avisoPara(e.target, avisos)), true);
  // Al corregir el campo se borra el aviso, para que vuelva a validarse solo.
  const borrarAviso = (e) => e.target.setCustomValidity?.("");
  form.addEventListener("input", borrarAviso);
  form.addEventListener("change", borrarAviso);
}

// ── El botón ──────────────────────────────────────────────────────────────
// Estados: "enviando", "listo", "error" o "" (normal). Cómo se ve cada uno
// vive en join.css ([data-estado]).
function ponerBoton(boton, estado, rotulo) {
  boton.dataset.estado = estado;
  boton.querySelector(".registro__boton-texto").textContent = rotulo;
}

const FORMAS_BROTE = ["hoja", "semilla", "punto"];
const COLORES_BROTE = ["--acento", "--arcilla", "--sabana"];

// Hojas y semillas que saltan del botón en abanico, hacia arriba.
function lanzarBrote(boton, { piezas, distancias, abanico: [desde, hasta] }) {
  for (let i = 0; i < piezas; i++) {
    const radianes = ((desde + ((hasta - desde) * i) / (piezas - 1)) * Math.PI) / 180;
    const distancia = distancias[i % distancias.length];
    const pieza = document.createElement("span");
    pieza.className = "registro__brote";
    pieza.style.setProperty("--x", `${Math.round(Math.cos(radianes) * distancia)}px`);
    pieza.style.setProperty("--y", `${Math.round(Math.sin(radianes) * distancia)}px`);
    pieza.style.setProperty("--forma", `var(--forma-${FORMAS_BROTE[i % FORMAS_BROTE.length]})`);
    pieza.style.setProperty("--color", `var(${COLORES_BROTE[i % COLORES_BROTE.length]})`);
    pieza.addEventListener("animationend", () => pieza.remove());
    boton.append(pieza);
  }
}

export function initRegistro(registro) {
  const form = document.querySelector(".registro__form");
  if (!form) return;
  const estado = form.querySelector(".registro__estado");
  const boton = form.querySelector(".registro__boton");
  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)");
  let vueltaANormal;

  const mostrar = (texto, clase) => {
    estado.className = "registro__estado";
    if (clase) estado.classList.add(clase);
    estado.textContent = texto;
  };

  avisosEnEspanol(form, registro.avisos);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (boton.dataset.estado === "enviando") return; // ya va en camino
    if (form.website.value) return; // honeypot: bot → se descarta en silencio
    mostrar("");
    if (!form.reportValidity()) return;

    if (!registro.endpoint) {
      // Modo demo: sin receptor configurado todavía.
      mostrar(registro.exito + " (demo: falta configurar el endpoint)", "is-ok");
      form.reset();
      return;
    }

    clearTimeout(vueltaANormal);
    boton.style.minWidth = `${boton.offsetWidth}px`; // que no cambie de ancho con el texto
    ponerBoton(boton, "enviando", registro.botonEnviando);
    try {
      await Promise.all([
        enviarAMailerLite(registro.endpoint, datosParaMailerLite(form)),
        esperar(BOTON.enviandoMinimo),
      ]);
      ponerBoton(boton, "listo", registro.botonListo);
      if (!sinMovimiento.matches) lanzarBrote(boton, BROTE);
      mostrar(registro.exito, "is-ok");
      form.reset();
      vueltaANormal = setTimeout(() => ponerBoton(boton, "", registro.boton), BOTON.listoDura);
    } catch {
      ponerBoton(boton, "error", registro.boton);
      mostrar(registro.error, "is-error");
    }
  });
}
