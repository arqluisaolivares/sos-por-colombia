# SOS por Colombia

Plataforma web que conecta a las familias afectadas por el **sismo de magnitud 7,4 del 10 de agosto de 2026**
con profesionales y voluntarios que se comprometen a acompañarlas caso por caso.

Una iniciativa de la **Fundación Profesionales Amigos**.

---

## Qué hace

| Sección | Para qué sirve |
|---|---|
| **Publicar mi caso** | Una familia cuenta su historia, sube fotos de su vivienda y marca lo que necesita. |
| **Familias** | Muro público de casos verificados, con filtros por departamento, necesidad y urgencia. |
| **Apadrinamiento** | Un profesional o voluntario inscrito escoge un caso y registra a qué se compromete. |
| **Profesionales** | Directorio e inscripción de arquitectos, ingenieros, médicos, psicólogos, abogados, topógrafos. |
| **Voluntarios** | Directorio e inscripción por oficios y habilidades: mampostería, conducción, cocina, censos. |
| **¿Dónde consigo ayuda?** | Líneas oficiales de emergencia, puntos de acopio, albergues y guía por tipo de necesidad. |
| **Tablero de resultados** | Página pública con las cifras: familias publicadas, acompañadas y resueltas, por departamento y por necesidad. |
| **Consultar mi caso** | La familia entra con su código (SOS-1234) y los últimos cuatro dígitos de su WhatsApp, y ve en qué va su caso y quién la acompaña. |
| **Panel de moderación** | Aprobar, rechazar y marcar como resuelto cada registro, avisar por WhatsApp, buscar profesionales para un caso y descargar todo a Excel. Acceso restringido por correo. |

### Cómo protege a las familias

- Todo entra como **pendiente**. Nada se publica sin que un moderador lo apruebe.
- El **teléfono, el correo y la dirección exacta nunca se publican**. Solo se comparten con quien apadrina el caso.
- En la página pública de un caso aparece únicamente el **primer nombre** de la persona de contacto.
- Las fotografías se publican solo si la familia marca la autorización expresa.
- El sitio web lee la base de datos a través de **vistas** que ya excluyen los campos reservados: aunque
  alguien inspeccione el código de la página, no puede llegar a los datos de contacto.

### Avisos por WhatsApp

Todos los formularios piden un **número de WhatsApp**, y desde el panel de moderación
hay un botón verde que abre WhatsApp con el mensaje ya escrito:

| Botón | Qué manda y a quién |
|---|---|
| **Avisar familia** (en Casos) | Le confirma a la familia que su caso quedó publicado, con el código y el enlace. |
| **Avisar familia** (en Apadrinamientos) | Le dice a la familia quién la va a acompañar, con el número del profesional y a qué se comprometió. |
| **Avisar padrino** | Le entrega al profesional los datos de contacto de la familia y lo que necesita. |
| **Avisar** (en Profesionales y Voluntarios) | Confirma que la inscripción quedó aprobada. |
| **Invitar** (dentro de "Buscar profesional") | Le pregunta a un profesional del directorio si puede tomar un caso concreto. |
| **Resumen al equipo** | Arma un mensaje con todo lo que está pendiente por revisar, para mandarlo al grupo del equipo. |

El moderador solo revisa el texto y presiona enviar. **No cuesta nada y no requiere
ningún trámite con Meta.** El sistema deja registrada la fecha del aviso para que
nadie reciba el mismo mensaje dos veces.

> **¿Y el envío automático?** Requiere una cuenta de WhatsApp Business API verificada
> por Meta a nombre de la Fundación, con costo por mensaje. El código quedó preparado:
> cuando la cuenta exista, se implementa `enviarAutomatico()` en
> `assets/js/whatsapp.js` desde una Edge Function de Supabase y el resto del sitio no
> cambia. Nunca se debe poner el token de Meta en el navegador: quedaría a la vista.

---

## Puesta en marcha

Son tres pasos. No hace falta instalar nada en su computador.

### Paso 1 · Publicar el sitio en GitHub Pages

1. Cree un repositorio nuevo en GitHub, por ejemplo `sos-por-colombia`.
2. Suba **todo el contenido de esta carpeta** al repositorio (arrastre los archivos en la web de GitHub,
   con el botón *Add file → Upload files*).
3. En el repositorio, entre a **Settings → Pages**.
4. En *Source* escoja **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarde.
5. En dos o tres minutos el sitio queda publicado en
   `https://SU-USUARIO.github.io/sos-por-colombia/`.

En este punto el sitio ya se ve completo, con datos de ejemplo. Todavía no guarda nada: eso es el paso 2.

### Paso 2 · Crear la base de datos en Supabase

Supabase es gratuito para un proyecto de este tamaño.

1. Cree una cuenta en <https://supabase.com> y luego un proyecto nuevo (región recomendada: *East US*).
2. Menú lateral → **SQL Editor** → *New query*.
3. Copie el contenido completo de `supabase/01_esquema.sql`, péguelo y presione **Run**.
4. Abra otra consulta, **cambie el correo del administrador** en `supabase/02_datos_iniciales.sql`,
   pegue el archivo y presione **Run**.
5. Abra una tercera consulta y ejecute `supabase/03_avisos_whatsapp.sql`
   (registro de avisos y vistas del tablero).
6. Abra una cuarta y ejecute `supabase/04_consulta_caso.sql`
   (consulta del caso por parte de la familia).
7. Menú lateral → **Project Settings → API**. Copie:
   - *Project URL*
   - la llave *anon public*

### Paso 3 · Conectar el sitio con la base de datos

Abra el archivo `assets/js/config.js` y pegue los dos valores:

```js
export const CONFIG = {
  SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...',
  ...
};
```

Guarde, súbalo a GitHub y listo: el aviso amarillo de "modo demostración" desaparece y el sitio empieza
a guardar de verdad.

> La llave *anon* es pública por diseño: es la que va en el navegador. La seguridad no depende de
> esconderla, sino de las políticas de acceso que ya quedaron creadas en el paso 2.

---

## Entrar al panel de moderación

1. Vaya a `.../admin.html`.
2. Escriba el correo que registró en la tabla `admins` y pida el enlace de acceso.
3. Abra el enlace que le llega al correo. Queda dentro; no hay contraseña.

**Antes del primer ingreso**, en Supabase:

- **Authentication → Providers → Email**: active *Email* y deje activo *Magic Link*.
- **Authentication → URL Configuration**: en *Site URL* y en *Redirect URLs* agregue la dirección de su
  GitHub Pages, por ejemplo `https://SU-USUARIO.github.io/sos-por-colombia/admin.html`.
- **Authentication → Users**: cree manualmente el usuario con su correo (el mismo de la tabla `admins`).

Para agregar más moderadores, repita: crear el usuario en *Authentication → Users* e insertar el correo
en la tabla `admins`.


---

## Buscarle profesional a un caso

En el panel, pestaña **Casos**, cada caso tiene el botón **Buscar profesional**. Abre el directorio
filtrado por el departamento del caso y pone de primeros a los profesionales cuyos servicios
coinciden con lo que la familia pidió. Al presionar **Invitar** se abre WhatsApp con el mensaje ya
escrito, preguntándole si puede tomar ese caso.

## Respaldo en Excel o Drive

El botón **Descargar Excel** del panel baja cinco archivos `.csv` —casos, profesionales,
voluntarios, apadrinamientos y puntos de ayuda— con la fecha en el nombre. Se abren directamente
en Excel y se pueden subir a Google Drive o importar a Google Sheets
(*Archivo → Importar → Subir*). Llevan BOM, así que las tildes y las eñes salen bien.

> La copia viva de los datos es la base de datos, no el Excel. El archivo es para respaldos y
> reportes. Tenga en cuenta que contiene teléfonos y direcciones: guárdelo en una carpeta de Drive
> restringida al equipo, no en una compartida con enlace público.

## Cómo consulta una familia su caso

La familia entra a `consulta.html`, escribe el código del caso y **los últimos cuatro dígitos** del
WhatsApp con el que reportó. Sin esos dos datos la consulta no devuelve nada, así que nadie puede
mirar casos ajenos. Ahí ve el estado, lo que pidió y —si ya tiene padrino— el nombre, la profesión,
el compromiso y el WhatsApp de quien la acompaña, con un botón para escribirle.

---

## Personalizar

| Qué cambiar | Dónde |
|---|---|
| Nombre, correo, WhatsApp, número de fotos permitidas | `assets/js/config.js` |
| Profesiones, habilidades, necesidades, departamentos | `assets/js/datos.js` |
| Cifras del sismo que aparecen en la portada | `assets/js/datos.js` → `CIFRAS_EVENTO` |
| Colores y tipografía | `assets/css/styles.css` (bloque `:root`) |
| Textos de cada página | los archivos `.html` |
| Política de datos personales | `privacidad.html` |
| Líneas oficiales del directorio | `supabase/02_datos_iniciales.sql` y `ayuda.html` |

---

## Probar en su computador (opcional)

```bash
cd sos-por-colombia
python3 -m http.server 8080
```

Y abra <http://localhost:8080>. Se necesita un servidor: abrir los archivos con doble clic no funciona,
porque el sitio usa módulos de JavaScript.

---

## Estructura

```
sos-por-colombia/
├── index.html              Portada
├── casos.html              Muro de familias
├── caso.html               Detalle de un caso + apadrinamiento
├── publicar.html           Formulario para familias damnificadas
├── profesionales.html      Directorio + inscripción de profesionales
├── voluntarios.html        Directorio + inscripción de voluntarios
├── ayuda.html              ¿Dónde consigo ayuda?
├── admin.html              Panel de moderación
├── tablero.html            Tablero público de resultados
├── consulta.html           Consulta del caso por parte de la familia
├── privacidad.html         Política de tratamiento de datos
├── assets/
│   ├── css/styles.css      Sistema de diseño
│   ├── img/favicon.svg
│   └── js/
│       ├── config.js       ← el único archivo que usted edita
│       ├── datos.js        Catálogos
│       ├── demo.js         Datos de ejemplo del modo demostración
│       ├── api.js          Conexión con Supabase
│       ├── ui.js           Encabezado, pie, formularios, avisos
│       ├── componentes.js  Tarjetas
│       ├── iconos.js       Juego de íconos dibujados
│       ├── graficas.js     Barras y cifras del tablero
│       ├── whatsapp.js     Mensajes y enlaces de WhatsApp
│       └── pag-*.js        Lógica de cada página
└── supabase/
    ├── 01_esquema.sql      Tablas, vistas y políticas de seguridad
    ├── 02_datos_iniciales.sql  Administradores y canales oficiales
    └── 03_avisos_whatsapp.sql  Registro de avisos y vistas del tablero
```

---

## Pendientes sugeridos para una siguiente versión

- Envío automático de WhatsApp cuando la Fundación tenga cuenta de WhatsApp Business API.
- Mapa de casos y puntos de acopio.
- Seguimiento del caso con línea de tiempo y evidencia fotográfica del avance.
- Exportación a Excel de los casos para reportes ante financiadores.
- Verificación de matrícula profesional contra los registros de los consejos profesionales.

---

## Licencia

Uso libre para fines humanitarios sin ánimo de lucro.
