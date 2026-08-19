/* SOS por Colombia · Página de inicio */

import { montarBase, $, $$, esc, vacio } from './ui.js';
import { traerEstadisticas, traerCasos } from './api.js';
import { tarjetaCaso } from './componentes.js';
import { NECESIDADES, CIFRAS_EVENTO } from './datos.js';

montarBase();

/* ---- Cifras de la plataforma ---- */
traerEstadisticas().then(e => {
  $$('[data-cifra]').forEach(el => {
    const v = e[el.dataset.cifra];
    el.textContent = (v === null || v === undefined) ? '0' : String(v);
  });
}).catch(() => {
  $$('[data-cifra]').forEach(el => { el.textContent = '0'; });
});

/* ---- Casos sin padrino ---- */
traerCasos({ estado: 'aprobado' }).then(lista => {
  const sinPadrino = lista.filter(c => !(c.padrinos || []).length);
  const mostrar = (sinPadrino.length ? sinPadrino : lista).slice(0, 3);
  $('#casos-portada').innerHTML = mostrar.length
    ? mostrar.map(tarjetaCaso).join('')
    : vacio('Todavía no hay casos publicados',
            'Cuando una familia reporte su situación y sea verificada, aparecerá aquí.', '🕊️');
}).catch(() => {
  $('#casos-portada').innerHTML = vacio('No fue posible cargar los casos', 'Intente recargar la página.', '⚠️');
});

/* ---- Tipos de ayuda ---- */
$('#tipos-ayuda').innerHTML = NECESIDADES.map(n => `
  <a class="tarjeta tarjeta--enlace" href="casos.html?necesidad=${encodeURIComponent(n.id)}"
     style="text-align:center;text-decoration:none;padding:20px 14px">
    <div style="font-size:1.9rem;line-height:1.2">${n.icono}</div>
    <div style="font-weight:600;font-size:.92rem;color:var(--ink);margin-top:6px">${esc(n.nombre)}</div>
  </a>`).join('');

/* ---- Contexto del evento ---- */
$('#contexto').innerHTML = `
  <div><div class="cifra__num">${esc(CIFRAS_EVENTO.magnitud)}</div><div class="cifra__etq">Magnitud del sismo</div></div>
  <div><div class="cifra__num">${esc(CIFRAS_EVENTO.municipios)}</div><div class="cifra__etq">Municipios afectados</div></div>
  <div><div class="cifra__num">${esc(CIFRAS_EVENTO.familias)}</div><div class="cifra__etq">Familias afectadas</div></div>
  <div><div class="cifra__num">${esc(CIFRAS_EVENTO.personas)}</div><div class="cifra__etq">Personas afectadas</div></div>`;
$('#fuente-contexto').textContent =
  `Epicentro: ${CIFRAS_EVENTO.epicentro} · ${CIFRAS_EVENTO.fecha}. Fuente: ${CIFRAS_EVENTO.fuente}.`;
