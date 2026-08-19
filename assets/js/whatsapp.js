/* =====================================================================
   SOS POR COLOMBIA · Avisos por WhatsApp
   ---------------------------------------------------------------------
   Sin costo y sin trámites: se arma el mensaje y se abre WhatsApp con el
   texto ya escrito. El moderador solo revisa y presiona enviar.

   Cuando la Fundación tenga una cuenta de WhatsApp Business API
   aprobada por Meta, basta con implementar `enviarAutomatico()` al final
   de este archivo; el resto del sitio no cambia.
   ===================================================================== */

import { M_NECESIDADES, M_PROFESIONES, nombreDe } from './datos.js';
import { CONFIG } from './config.js';

/* ------------------------------------------------------------------ */
/* Números                                                             */
/* ------------------------------------------------------------------ */

/**
 * Normaliza un número colombiano al formato internacional que exige
 * WhatsApp: 57 + 10 dígitos, sin espacios ni signos.
 * Devuelve null si no parece un número válido.
 */
export function normalizar(numero) {
  if (!numero) return null;
  let d = String(numero).replace(/\D/g, '');

  if (d.startsWith('0057')) d = d.slice(4);
  if (d.startsWith('57') && d.length === 12) return d;      // ya viene completo
  if (d.length === 10 && d.startsWith('3')) return '57' + d; // celular colombiano
  if (d.length === 7 || d.length === 8) return null;         // fijo: no sirve para WhatsApp
  if (d.length >= 11 && d.length <= 15) return d;            // otro país
  return null;
}

/** Formato bonito para mostrar en pantalla: 300 000 0000 */
export function mostrar(numero) {
  const d = normalizar(numero);
  if (!d) return numero || '';
  const local = d.startsWith('57') ? d.slice(2) : d;
  return local.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

/** ¿Se puede escribir por WhatsApp a este número? */
export const esWhatsApp = (numero) => normalizar(numero) !== null;

/** Enlace listo para abrir la conversación con el texto escrito. */
export function enlace(numero, mensaje) {
  const d = normalizar(numero);
  if (!d) return null;
  return `https://wa.me/${d}?text=${encodeURIComponent(mensaje)}`;
}

/** Abre WhatsApp en otra pestaña. Devuelve false si el número no sirve. */
export function abrir(numero, mensaje) {
  const url = enlace(numero, mensaje);
  if (!url) return false;
  window.open(url, '_blank', 'noopener');
  return true;
}

/* ------------------------------------------------------------------ */
/* Mensajes                                                            */
/* ------------------------------------------------------------------ */

const FIRMA = `\n\n— Equipo SOS por Colombia · ${CONFIG.ORGANIZACION}`;
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';

const listaNecesidades = (ids = []) =>
  ids.map(i => nombreDe(M_NECESIDADES, i)).filter(Boolean).join(', ');

/** 1. La familia se entera de quién la va a acompañar. */
export function mensajeFamiliaApadrinada(caso, padrino) {
  return (
`Hola ${primerNombre(caso.nombre_contacto)}, le escribimos de SOS por Colombia.

Buenas noticias: su caso ${caso.codigo} ya tiene quien lo acompañe.

*${padrino.nombre}*${padrino.profesion ? ` — ${nombreDe(M_PROFESIONES, padrino.profesion, padrino.profesion)}` : ''}
WhatsApp: ${mostrar(padrino.telefono) || 'lo enviamos enseguida'}

Se comprometió a: ${padrino.compromiso}${padrino.plazo ? `\nPlazo: ${padrino.plazo}` : ''}

Puede escribirle directamente a ese número. Si algo no funciona, respóndanos por aquí y lo resolvemos.` + FIRMA);
}

/** 2. El profesional recibe los datos de la familia. */
export function mensajeProfesional(caso, padrino) {
  return (
`Hola ${primerNombre(padrino.nombre)}, le escribimos de SOS por Colombia.

Su compromiso con el caso ${caso.codigo} quedó aprobado. Estos son los datos de la familia:

*${caso.nombre_contacto}*
WhatsApp: ${mostrar(caso.telefono)}
Dónde: ${caso.municipio || ''}${caso.barrio ? `, ${caso.barrio}` : ''} (${caso.departamento || ''})
Hogar: ${caso.personas_hogar || '—'} personas${caso.ninos ? `, ${caso.ninos} niñas o niños` : ''}${caso.adultos_mayores ? `, ${caso.adultos_mayores} adultos mayores` : ''}
Necesita: ${listaNecesidades(caso.necesidades)}

Su compromiso: ${padrino.compromiso}${padrino.plazo ? `\nPlazo: ${padrino.plazo}` : ''}

Le pedimos comunicarse con la familia en los próximos días y contarnos cómo va. Estos datos son reservados: úselos solo para este acompañamiento.` + FIRMA);
}

/** 3. La familia se entera de que su caso quedó publicado. */
export function mensajeCasoAprobado(caso, url) {
  return (
`Hola ${primerNombre(caso.nombre_contacto)}, le escribimos de SOS por Colombia.

Su caso quedó publicado con el código *${caso.codigo}*.${url ? `\nPuede verlo aquí: ${url}` : ''}

Le avisaremos por este mismo WhatsApp apenas un profesional o un voluntario se comprometa a acompañarlos. Guarde el código: con él hacemos el seguimiento.` + FIRMA);
}

/** 4. Confirmación al profesional o voluntario recién aprobado. */
export function mensajeInscripcionAprobada(persona, perfil = 'profesional') {
  return (
`Hola ${primerNombre(persona.nombre)}, su inscripción como ${perfil} en SOS por Colombia quedó aprobada.

Ya puede entrar a la página, escoger una familia y registrar a qué se compromete. Use el mismo correo con el que se inscribió (${persona.email}).

Gracias por poner su oficio al servicio de quienes lo perdieron todo.` + FIRMA);
}

/** 5. Invitación a un profesional para que tome un caso. */
export function mensajeInvitacion(caso, profesional, url) {
  return (
`Hola ${primerNombre(profesional.nombre)}, le escribimos de SOS por Colombia.

Tenemos un caso que encaja con lo que usted ofrece y queremos preguntarle si puede tomarlo:

*${caso.codigo} — ${caso.titulo}*
Dónde: ${caso.municipio || ''} (${caso.departamento || ''})
Hogar: ${caso.personas_hogar || '—'} personas${caso.ninos ? `, ${caso.ninos} niñas o niños` : ''}
Necesita: ${listaNecesidades(caso.necesidades)}${url ? `\n\nPuede ver el caso completo aquí: ${url}` : ''}

Si puede acompañarlo, respóndanos por aquí y le pasamos los datos de contacto de la familia. Si no puede en este momento, también dígalo con confianza: buscamos a otra persona.` + FIRMA);
}

/** 6. Resumen para el equipo coordinador. */
export function mensajeResumenEquipo(conteos) {
  return (
`*SOS por Colombia — pendientes por revisar*

Casos de familias: ${conteos.casos || 0}
Profesionales: ${conteos.profesionales || 0}
Voluntarios: ${conteos.voluntarios || 0}
Apadrinamientos por confirmar: ${conteos.apadrinamientos || 0}

Panel: ${location.origin}${location.pathname.replace(/[^/]*$/, '')}admin.html`);
}

/* ------------------------------------------------------------------ */
/* Envío automático (pendiente de cuenta de WhatsApp Business API)     */
/* ------------------------------------------------------------------ */

/**
 * Marcador de posición para el día en que la Fundación tenga aprobada
 * una cuenta de WhatsApp Business API.
 *
 * El envío NO puede hacerse desde el navegador: la llave quedaría a la
 * vista de cualquiera. Debe hacerse desde una Edge Function de Supabase
 * que reciba {telefono, plantilla, variables} y llame a
 * https://graph.facebook.com/v20.0/<PHONE_ID>/messages con el token
 * guardado como secreto del proyecto.
 *
 * Mientras tanto, todo el sitio usa `abrir()` y no cuesta un peso.
 */
export async function enviarAutomatico() {
  throw new Error('El envío automático todavía no está configurado. Use el botón de WhatsApp.');
}
