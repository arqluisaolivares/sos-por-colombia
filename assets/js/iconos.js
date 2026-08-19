/* =====================================================================
   SOS POR COLOMBIA · Juego de íconos
   ---------------------------------------------------------------------
   Íconos de trazo, dibujados sobre una retícula de 24 × 24.
   Heredan el color del texto (currentColor), así que se adaptan solos
   a cada fondo. Para agregar uno nuevo basta con sumar su trazado aquí.
   ===================================================================== */

export const TRAZOS = {

  /* --- Vivienda y reconstrucción ------------------------------------ */
  'casa-danada':
    '<path d="M3.6 10.6 12 3.8l8.4 6.8V19a1.6 1.6 0 0 1-1.6 1.6H5.2A1.6 1.6 0 0 1 3.6 19Z"/>' +
    '<path d="M13.3 9.8 11 13.4l2.4 1.3-1.9 3.6"/>',

  'casa-corazon':
    '<path d="M3.6 10.6 12 3.8l8.4 6.8V19a1.6 1.6 0 0 1-1.6 1.6H5.2A1.6 1.6 0 0 1 3.6 19Z"/>' +
    '<path d="M12 18.2s-2.9-1.8-2.9-3.8a1.6 1.6 0 0 1 2.9-.9 1.6 1.6 0 0 1 2.9.9c0 2-2.9 3.8-2.9 3.8Z"/>',

  'escuadra':
    '<path d="M3.6 20.4h16.8V3.6Z"/>' +
    '<path d="M8.2 17.6h8.4V9.2Z"/>' +
    '<path d="M7 20.4v-1.8M10.4 20.4v-1.8M13.8 20.4v-1.8M17.2 20.4v-1.8"/>',

  'ladrillos':
    '<path d="M3.4 7.4h17.2v4.3H3.4zM3.4 12.3h17.2v4.3H3.4z"/>' +
    '<path d="M9.1 7.4v4.3M14.9 7.4v4.3M6.2 12.3v4.3M12 12.3v4.3M17.8 12.3v4.3"/>',

  'herramienta':
    '<path d="M4.4 16.8a7.6 7.6 0 0 1 15.2 0Z"/>' +
    '<path d="M2.8 16.8h18.4a1.2 1.2 0 0 1 0 2.4H2.8a1.2 1.2 0 0 1 0-2.4Z"/>' +
    '<path d="M9.4 16.8v-5.6a2.6 2.6 0 0 1 5.2 0v5.6"/>',

  'lupa-casa':
    '<path d="M4.2 11.2 10.6 6l6.4 5.2v6.2a1.3 1.3 0 0 1-1.3 1.3H5.5a1.3 1.3 0 0 1-1.3-1.3Z"/>' +
    '<circle cx="16.8" cy="8.2" r="3.6"/><path d="M19.6 11 22 13.4"/>',

  'carpa':
    '<path d="M12 4 3.4 20.2h17.2Z"/><path d="M12 4v16.2"/>' +
    '<path d="M12 20.2 15.6 13M12 20.2 8.4 13"/><path d="M2.4 20.2h19.2"/>',

  /* --- Necesidades básicas ------------------------------------------ */
  'olla':
    '<path d="M3.6 11.8h16.8a8.4 8.4 0 0 1-16.8 0Z"/>' +
    '<path d="M2.4 11.8h19.2"/>' +
    '<path d="M8.4 8.2c0-1.4 1.4-1.4 1.4-2.8M12 8.2c0-1.4 1.4-1.4 1.4-2.8M15.6 8.2c0-1.4 1.4-1.4 1.4-2.8"/>',

  'gota':
    '<path d="M12 3.4s6.5 6.6 6.5 10.6a6.5 6.5 0 0 1-13 0C5.5 10 12 3.4 12 3.4Z"/>' +
    '<path d="M9 14.4a3 3 0 0 0 3 3"/>',

  'cama':
    '<path d="M3 19.4V8.6M3 14.2h18v5.2M21 14.2v-2.6a2.6 2.6 0 0 0-2.6-2.6H11v5.2"/>' +
    '<circle cx="7" cy="11.4" r="1.9"/>',

  'camiseta':
    '<path d="M8.6 4 4.2 6.6l2 3.6 2.4-1.2v11h10.8v-11l2.4 1.2 2-3.6L19.4 4"/>' +
    '<path d="M8.6 4a3.4 3.4 0 0 0 6.8 0"/>',

  'mochila':
    '<path d="M6.8 8.4h10.4a3 3 0 0 1 3 3V18a2.6 2.6 0 0 1-2.6 2.6H6.4A2.6 2.6 0 0 1 3.8 18v-6.6a3 3 0 0 1 3-3Z"/>' +
    '<path d="M8.8 8.4V6.2a3.2 3.2 0 0 1 6.4 0v2.2"/><path d="M9.4 13.4h5.2"/>' +
    '<path d="M10 20.6v-3.4h4v3.4"/>',

  'huella':
    '<ellipse cx="7.2" cy="9" rx="1.9" ry="2.6"/><ellipse cx="12" cy="7.2" rx="1.9" ry="2.7"/>' +
    '<ellipse cx="16.8" cy="9" rx="1.9" ry="2.6"/>' +
    '<path d="M12 12.4c3.1 0 5 2.2 5 4.4 0 2-1.7 3.4-3.6 2.9-1-.3-1.8-.3-2.8 0-1.9.5-3.6-.9-3.6-2.9 0-2.2 1.9-4.4 5-4.4Z"/>',

  'camion':
    '<path d="M3.2 6.8h10.6v10.4H3.2z"/><path d="M13.8 10.4h3.8l3.2 3.2v3.6h-7z"/>' +
    '<circle cx="7.2" cy="18.2" r="1.9"/><circle cx="17.4" cy="18.2" r="1.9"/>',

  /* --- Personas y cuidado ------------------------------------------- */
  'salud':
    '<rect x="3.6" y="4.6" width="16.8" height="14.8" rx="4"/>' +
    '<path d="M12 8.4v7.2M8.4 12h7.2"/>',

  'corazon':
    '<path d="M12 20.4s-7-4.4-7-9.1a3.6 3.6 0 0 1 7-1.5 3.6 3.6 0 0 1 7 1.5c0 4.7-7 9.1-7 9.1Z"/>',

  'balanza':
    '<path d="M12 4.4v15.4M6.6 19.8h10.8M3.8 8.6h16.4M12 8.6 12 6"/>' +
    '<path d="M3.8 8.6 1.6 13.8a2.7 2.7 0 0 0 4.4 0Z"/>' +
    '<path d="M20.2 8.6 18 13.8a2.7 2.7 0 0 0 4.4 0Z"/>',

  'personas':
    '<circle cx="9.2" cy="8.2" r="3.1"/><circle cx="16.6" cy="9" r="2.4"/>' +
    '<path d="M3.2 20c0-3.4 2.7-5.6 6-5.6s6 2.2 6 5.6"/>' +
    '<path d="M16.4 14.6c2.8.3 4.4 2.3 4.4 5.4"/>',

  'manos':
    '<path d="M12 11.4s-3.2-2-3.2-3.9A1.8 1.8 0 0 1 12 6.4a1.8 1.8 0 0 1 3.2 1.1c0 1.9-3.2 3.9-3.2 3.9Z"/>' +
    '<path d="M4 20.6a5.8 5.8 0 0 1 5.8-5.8h4.4a5.8 5.8 0 0 1 5.8 5.8"/>' +
    '<path d="M9.4 20.6v-3.4M14.6 20.6v-3.4"/>',

  /* --- Proceso ------------------------------------------------------- */
  'camara':
    '<path d="M3.4 8.8h3.4l1.6-2.4h7.2l1.6 2.4h3.4a1.2 1.2 0 0 1 1.2 1.2v8.4a1.2 1.2 0 0 1-1.2 1.2H3.4a1.2 1.2 0 0 1-1.2-1.2V10a1.2 1.2 0 0 1 1.2-1.2Z"/>' +
    '<circle cx="12" cy="13.8" r="3.4"/>',

  'escudo':
    '<path d="M12 3.2 19.4 6v6.2c0 4.5-3.2 7.5-7.4 8.8-4.2-1.3-7.4-4.3-7.4-8.8V6Z"/>' +
    '<path d="M8.8 12.2 11 14.4l4.2-4.4"/>',

  'documento':
    '<path d="M6 3.6h8.4L19 8.2v11a1.4 1.4 0 0 1-1.4 1.4H6a1.4 1.4 0 0 1-1.4-1.4V5a1.4 1.4 0 0 1 1.4-1.4Z"/>' +
    '<path d="M14 3.6v4.8h5M8 13h8M8 16.6h5.4"/>',

  'telefono':
    '<path d="M6.4 3.6h2.8l1.6 4-2 1.4a11 11 0 0 0 6.2 6.2l1.4-2 4 1.6v2.8a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2Z"/>',

  'ubicacion':
    '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'
};

/**
 * Devuelve el SVG de un ícono.
 * @param {string} nombre  clave dentro de TRAZOS
 * @param {number} tamano  tamaño en píxeles
 * @param {number} grosor  grosor del trazo
 */
export function icono(nombre, tamano = 24, grosor = 1.6) {
  const d = TRAZOS[nombre];
  if (!d) return '';
  return `<svg class="ico" width="${tamano}" height="${tamano}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false">${d}</svg>`;
}
