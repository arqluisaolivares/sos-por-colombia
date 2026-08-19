/* =====================================================================
   SOS POR COLOMBIA · Gráficas del tablero
   ---------------------------------------------------------------------
   Sin librerías. Barras en HTML para que se adapten solas al ancho de
   la pantalla y funcionen igual en celular.

   Color: una sola tonalidad para magnitud (todas las barras iguales,
   porque el largo ya dice cuánto) y una rampa de tres pasos, de claro a
   oscuro, para el avance de los casos (sin padrino → apadrinado →
   resuelto), que sí tiene orden.
   ===================================================================== */

import { esc } from './ui.js';

export const COLOR_SERIE = '#3A67B4';
export const RAMPA_AVANCE = ['#8AA7D6', '#3A67B4', '#0B2E6F'];

const nf = new Intl.NumberFormat('es-CO');
export const num = (n) => nf.format(Number(n) || 0);

/* ------------------------------------------------------------------ */
/* Tarjeta de cifra                                                     */
/* ------------------------------------------------------------------ */
export function tarjetaCifra({ valor, etiqueta, detalle, tono = '' }) {
  return `
  <div class="cifra-tarjeta${tono ? ' cifra-tarjeta--' + tono : ''}">
    <div class="cifra-tarjeta__num">${esc(num(valor))}</div>
    <div class="cifra-tarjeta__etq">${esc(etiqueta)}</div>
    ${detalle ? `<div class="cifra-tarjeta__det">${esc(detalle)}</div>` : ''}
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Barras horizontales (una sola serie)                                 */
/* ------------------------------------------------------------------ */
/**
 * @param {Array<{etiqueta:string, valor:number, nota?:string}>} datos
 * @param {{titulo:string, descripcion?:string, unidad?:string, tope?:number}} op
 */
export function barras(datos, op = {}) {
  const filas = datos.filter(d => Number(d.valor) > 0);
  if (!filas.length) {
    return bloque(op, `<p class="grafica__vacio">Todavía no hay datos suficientes.</p>`);
  }
  const tope = op.tope || Math.max(...filas.map(d => Number(d.valor)));

  const cuerpo = filas.map(d => {
    const v = Number(d.valor);
    const ancho = Math.max(2, (v / tope) * 100);
    const titulo = `${d.etiqueta}: ${num(v)}${op.unidad ? ' ' + op.unidad : ''}${d.nota ? ' · ' + d.nota : ''}`;
    return `
    <div class="barra" title="${esc(titulo)}">
      <span class="barra__etq">${esc(d.etiqueta)}</span>
      <span class="barra__pista">
        <span class="barra__valor" style="width:${ancho.toFixed(1)}%;background:${COLOR_SERIE}"></span>
      </span>
      <span class="barra__num">${esc(num(v))}</span>
    </div>`;
  }).join('');

  const tabla = `
  <details class="grafica__tabla">
    <summary>Ver los datos en tabla</summary>
    <div class="tabla-envoltura">
      <table>
        <thead><tr><th>${esc(op.columna || 'Categoría')}</th><th>${esc(op.unidad || 'Casos')}</th></tr></thead>
        <tbody>${filas.map(d =>
          `<tr><td>${esc(d.etiqueta)}</td><td>${esc(num(d.valor))}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </details>`;

  return bloque(op, `<div class="barras">${cuerpo}</div>${tabla}`);
}

/* ------------------------------------------------------------------ */
/* Avance de los casos (rampa ordinal de tres pasos)                    */
/* ------------------------------------------------------------------ */
export function avance({ sin_padrino = 0, apadrinados = 0, resueltos = 0 }, op = {}) {
  const partes = [
    { etiqueta: 'Sin padrino todavía', valor: Number(sin_padrino), color: RAMPA_AVANCE[0] },
    { etiqueta: 'Con padrino',         valor: Number(apadrinados), color: RAMPA_AVANCE[1] },
    { etiqueta: 'Caso resuelto',       valor: Number(resueltos),   color: RAMPA_AVANCE[2] }
  ];
  const total = partes.reduce((s, p) => s + p.valor, 0);

  if (!total) {
    return bloque(op, `<p class="grafica__vacio">Todavía no hay casos publicados.</p>`);
  }

  const segmentos = partes.filter(p => p.valor > 0).map(p => `
    <span class="avance__parte" style="flex:${p.valor};background:${p.color}"
          title="${esc(p.etiqueta)}: ${esc(num(p.valor))} de ${esc(num(total))}"></span>`).join('');

  const leyenda = partes.map(p => `
    <span class="leyenda__item">
      <span class="leyenda__punto" style="background:${p.color}"></span>
      ${esc(p.etiqueta)} <strong>${esc(num(p.valor))}</strong>
      <span class="leyenda__pct">${total ? Math.round(p.valor / total * 100) : 0}%</span>
    </span>`).join('');

  return bloque(op, `
    <div class="avance">${segmentos}</div>
    <div class="leyenda">${leyenda}</div>`);
}

/* ------------------------------------------------------------------ */
function bloque(op, contenido) {
  return `
  <figure class="grafica">
    <figcaption>
      <h3>${esc(op.titulo || '')}</h3>
      ${op.descripcion ? `<p>${esc(op.descripcion)}</p>` : ''}
    </figcaption>
    ${contenido}
    ${op.fuente ? `<p class="grafica__fuente">${esc(op.fuente)}</p>` : ''}
  </figure>`;
}
