# Registro de correos → MailerLite (pendiente)

Guía para conectar el formulario **"Súmate"** a MailerLite cuando se retome.
El objetivo: recoger nombre + correo de los vecinos para enviarles después el
**mensaje de resultados del evento** (y avisar cuando esté el mapa v2).

## Estado actual del código
- El formulario **ya está construido y estilizado** (funciona en los 4 temas).
- Vive en:
  - Contenido/config → `src/content.js` (export `registro`)
  - Marcado → `src/render.js` (`renderRegistro`)
  - Envío (fetch + estados + honeypot) → `src/main.js`
  - Estilos → `src/style.css` (`.registro__*`, `.campo__*`)
- Corre en **modo demo**: mientras `registro.endpoint` esté vacío, no envía nada,
  solo muestra el estado de éxito. Al pegar el endpoint, empieza a guardar de verdad.

## Por qué MailerLite
- Hace **captura + envío** en un solo lugar → no hay que exportar CSV ni migrar
  para mandar el correo de resultados.
- **Gratis hasta 1.000 suscriptores** (suficiente para arrancar).
- Formularios/editor pulidos, en español, doble opt-in y consentimiento.
- Se integra al sitio estático con un **endpoint público** (no es llave secreta).

## Pasos en MailerLite (una sola vez, los hace una persona)
1. Crear cuenta en https://mailerlite.com (plan Free).
2. Subscribers → Groups → crear grupo **"Sembrando Futuros — vecinos"**.
3. (Opcional) Subscribers → Fields → crear campo de texto **"barrio"**
   (solo si se quiere capturar el barrio para el mapa; si no, se omite ese campo).
4. Forms → **Embedded form** → conectarlo al grupo del paso 2.
5. Activar **doble opt-in** en los ajustes del formulario (recomendado:
   mejor consentimiento y entregabilidad).
6. Copiar el **código de inserción en HTML** (no la versión "solo JavaScript").

## Qué se necesita para conectar el código
Del código HTML del embed se extrae, sin exponer secretos:
- La **URL del endpoint** (algo como `https://assets.mailerlite.com/jsonp/<account>/forms/<formId>/subscribe`).
- Los **nombres de los campos** que espera MailerLite (email, nombre, barrio).

Luego, en `src/content.js`:
```js
export const registro = {
  // ...
  endpoint: "<URL del endpoint del embed>",
  accessKey: "", // MailerLite no usa access key; se deja vacío
};
```
> Nota de seguridad: el account/form ID de MailerLite es **público** (va en el
> embed), no es una llave secreta. Es seguro dejarlo en el código. Si de todas
> formas se prefiere no versionarlo, se puede leer de una variable de entorno
> (`import.meta.env.VITE_FORM_ENDPOINT`) puesta en Netlify — pero recordar que
> en un sitio estático el valor igual termina en el JS compilado (y está bien,
> por ser público).

## Al conectar, verificar
- [ ] Enviar un registro de prueba y confirmar que llega al grupo en MailerLite.
- [ ] Que el correo de doble opt-in ("confirma tu suscripción") llegue bien.
- [ ] Que los nombres de los campos del `<form>` coincidan con los de MailerLite.
- [ ] Revisar el texto del **consentimiento** y el enlace de **aviso de privacidad**
      (Ley 1581 de 2012 · Habeas Data): finalidad, quién trata el dato, cómo darse de baja.

## Alternativas (por si cambia la decisión)
- **Brevo** — contactos ilimitados gratis, 300 envíos/día. Para listas > 1.000.
- **Formspree / Web3Forms** — solo captura → exportar CSV. Si se quiere recolectar
  ahora y decidir el envío después.
- **Flodesk** — captura + envío con diseño muy pulido, pero de pago (tarifa plana,
  sin tier gratis fuerte). Para cuando el envío de correos sea recurrente.
