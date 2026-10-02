# Registro de correos → MailerLite

El formulario **"Súmate"** guarda nombre + correo de los vecinos en MailerLite,
para enviarles después el **mensaje de resultados del evento** (y avisar cuando
esté el mapa v2). Conectado el 2026-10-01: guarda nombre, correo y barrio
(campo propio `barrio`, etiqueta `{$barrio}`), con el doble opt-in apagado.

## Dónde vive
- Textos y `endpoint` → `src/content.js` (export `registro`)
- Marcado → `src/sections/join/join.js` (`renderColectivoSumate`)
- Envío (traducción a MailerLite + estados + honeypot) → `src/sections/join/signup.js`
- Estilos → `src/sections/join/join.css` (`.registro__*`, `.campo__*`)

Si `registro.endpoint` está vacío, el formulario corre en **modo demo**: no envía
nada, solo muestra el estado de éxito.

## Cómo está conectado
- El sitio usa **su propio formulario**, con su diseño. De MailerLite solo toma
  la dirección a la que se envían los datos: el `action` del `<form>` en el código
  HTML del formulario embebido
  (`https://assets.mailerlite.com/jsonp/<cuenta>/forms/<formulario>/subscribe`).
  Es pública (va en cualquier embed), no es una llave secreta.
- El diseño, los textos y el mensaje de éxito que se editen en MailerLite **no
  aparecen en el sitio**. Lo que la gente sí ve de MailerLite es el correo de
  confirmación (doble opt-in) y la página a la que lleva.
- `signup.js` traduce nuestros campos a los nombres de MailerLite
  (`CAMPOS_MAILERLITE`: `nombre` → `fields[name]`, `email` → `fields[email]`,
  `barrio` → `fields[barrio]`) y agrega los dos ocultos del embed (`ml-submit`,
  `anticsrf`).
- MailerLite responde **200 incluso cuando rechaza** un registro; el resultado
  real viene en el JSON (`{"success": true}` o `false` + `errors`). Acepta
  peticiones desde cualquier dominio (CORS `*`), así que funciona igual en local
  y publicado.
- No se carga el script de MailerLite (`webforms.min.js`) ni su contador de
  vistas, así el sitio sigue liviano. Lo único que se pierde es la estadística de
  vistas del formulario en MailerLite; los suscriptores sí se cuentan.

## Montarlo desde cero (otra ciudad u otra cuenta)
1. Crear cuenta en https://mailerlite.com (plan Free) y llenar el perfil:
   MailerLite **aprueba la cuenta** antes de dejar enviar correos (revisa el
   perfil y la web; puede tardar hasta un día).
2. Subscribers → Groups → crear el grupo (aquí: **"Sembrando Futuros — vecinos"**).
3. (Opcional) Subscribers → Fields → crear el campo de texto **barrio**.
4. Forms → **Embedded form** → conectarlo al grupo. En el formulario, agregar el
   campo **Name** (y **barrio**, si se creó). El diseño da igual.
5. Decidir el **doble opt-in**. Con él, cada registro queda "sin confirmar"
   (no recibe correos) hasta que la persona da clic en un correo de confirmación
   que en el plan gratis no se puede editar: sale en inglés y puede caer en spam.
   Sin él, el registro queda activo de una vez.
6. Copiar el **código HTML** del formulario, tomar el `action="…"` del `<form>` y
   pegarlo en `registro.endpoint`. Si el formulario tiene otros campos, ajustar
   `CAMPOS_MAILERLITE` en `signup.js`.

Remitente de los correos: sirve un correo gratuito (@gmail…), al que MailerLite
le agrega un subdominio suyo; con un dominio propio autenticado llegan mejor.

## Campo "barrio"
Es un campo propio de MailerLite (no el *Last name* con otra etiqueta: por dentro
seguiría siendo el apellido). Si no se va a usar, quitarlo de `join.js`, de
`registro.campos` y de `CAMPOS_MAILERLITE`.

## Verificar (al conectar o al cambiar algo)
- [ ] Un registro de prueba llega al grupo en MailerLite.
- [ ] Si el doble opt-in está activo: llega el correo de confirmación (revisar spam)
      y, mientras no se confirme, el registro aparece en Subscribers → Unconfirmed.
- [ ] Revisar el texto del **consentimiento** y el enlace de **aviso de privacidad**
      (Ley 1581 de 2012 · Habeas Data): finalidad, quién trata el dato, cómo darse
      de baja. Hoy el enlace apunta a `#`.

## Por qué MailerLite
- Hace **captura + envío** en un solo lugar → no hay que exportar CSV ni migrar
  para mandar el correo de resultados.
- **Gratis hasta 1.000 suscriptores** (suficiente para arrancar).
- Formularios en español, doble opt-in y consentimiento.

## Alternativas (por si cambia la decisión)
- **Brevo** — contactos ilimitados gratis, 300 envíos/día. Para listas > 1.000.
- **Formspree / Web3Forms** — solo captura → exportar CSV. Habría que cambiar la
  traducción de campos en `signup.js`.
- **Flodesk** — captura + envío con diseño muy pulido, pero de pago (tarifa plana,
  sin tier gratis fuerte). Para cuando el envío de correos sea recurrente.
