/* SOS por Colombia · Tablero público de resultados */

import { montarBase, $, vacio } from './ui.js';
import { traerTablero } from './api.js';
import { tarjetaCifra, barras, avance, num } from './graficas.js';
import { M_NECESIDADES, nombreDe, CIFRAS_EVENTO } from './datos.js';

montarBase();

traerTablero().then(d => {
  const a = d.avance || {};
  const e = d.estadisticas || {};
  const publicados = (a.sin_padrino || 0) + (a.apadrinados || 0) + (a.resueltos || 0);
  const acompanados = (a.apadrinados || 0) + (a.resueltos || 0);
  const porcentaje = publicados ? Math.round(acompanados / publicados * 100) : 0;

  /* ---- Cifras principales ---- */
  $('#cifras').innerHTML = [
    tarjetaCifra({
      valor: publicados, etiqueta: 'Familias publicadas',
      detalle: 'Casos verificados por el equipo'
    }),
    tarjetaCifra({
      valor: acompanados, etiqueta: 'Familias acompañadas',
      detalle: `${porcentaje}% de los casos publicados`, tono: 'dorado'
    }),
    tarjetaCifra({
      valor: a.resueltos || 0, etiqueta: 'Casos resueltos',
      detalle: 'La familia confirmó que se cumplió', tono: 'verde'
    }),
    tarjetaCifra({
      valor: (e.profesionales || 0) + (e.voluntarios || 0), etiqueta: 'Personas inscritas para ayudar',
      detalle: `${num(e.profesionales || 0)} profesionales · ${num(e.voluntarios || 0)} voluntarios`
    })
  ].join('');

  /* ---- Avance ---- */
  $('#avance').innerHTML = avance(a, {
    titulo: 'En qué van los casos',
    descripcion: 'Cada caso publicado avanza de izquierda a derecha: primero busca padrino, luego lo tiene, y al final queda resuelto.'
  });

  /* ---- Departamentos ---- */
  $('#departamentos').innerHTML = barras(
    (d.departamentos || []).slice(0, 10).map(x => ({
      etiqueta: x.departamento,
      valor: x.casos,
      nota: x.resueltos ? `${x.resueltos} resueltos` : ''
    })),
    {
      titulo: 'Dónde están las familias',
      descripcion: 'Casos publicados por departamento.',
      columna: 'Departamento', unidad: 'Casos'
    }
  );

  /* ---- Necesidades ---- */
  $('#necesidades').innerHTML = barras(
    (d.necesidades || []).slice(0, 10).map(x => ({
      etiqueta: nombreDe(M_NECESIDADES, x.necesidad, x.necesidad),
      valor: x.casos
    })),
    {
      titulo: 'Qué es lo que más se pide',
      descripcion: 'Un mismo caso puede pedir varias cosas.',
      columna: 'Necesidad', unidad: 'Casos'
    }
  );

  /* ---- Personas detrás de las cifras ---- */
  $('#personas').innerHTML = `
    <div class="tarjeta">
      <h3>Detrás de cada caso</h3>
      <dl style="margin:0">
        <div class="dato"><dt>Personas en los hogares atendidos</dt><dd>${num(a.personas || 0)}</dd></div>
        <div class="dato"><dt>Niñas y niños</dt><dd>${num(a.ninos || 0)}</dd></div>
        <div class="dato"><dt>Departamentos con casos</dt><dd>${num((d.departamentos || []).length)}</dd></div>
        <div class="dato"><dt>Compromisos registrados</dt><dd>${num(e.apadrinamientos || 0)}</dd></div>
      </dl>
      <p style="font-size:.79rem;color:var(--ink-3);margin:16px 0 0">
        Contexto del evento: sismo de magnitud ${CIFRAS_EVENTO.magnitud} del ${CIFRAS_EVENTO.fecha},
        ${CIFRAS_EVENTO.municipios} municipios afectados y ${CIFRAS_EVENTO.familias} familias damnificadas
        en todo el país. Fuente: ${CIFRAS_EVENTO.fuente}.
      </p>
    </div>`;

}).catch(err => {
  $('#cifras').innerHTML = vacio('No fue posible cargar el tablero', err.message, '⚠️');
});
