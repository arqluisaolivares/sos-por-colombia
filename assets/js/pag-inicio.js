/* SOS por Colombia · Portada (navegación pantalla por pantalla) */

import { montarBase, $, $$, esc, vacio } from './ui.js';
import { traerEstadisticas, traerCasos } from './api.js';
import { tarjetaCaso } from './componentes.js';
import { NECESIDADES, CIFRAS_EVENTO } from './datos.js';
import { icono } from './iconos.js';

montarBase();

/* ------------------------------------------------------------------ */
/* Fichas de necesidades                                               */
/* ------------------------------------------------------------------ */
const enCelular = window.matchMedia('(max-width:640px)').matches;
$('#tipos-ayuda').innerHTML = NECESIDADES.slice(0, enCelular ? 6 : 12).map(n => `
  <a class="ficha" href="casos.html?necesidad=${encodeURIComponent(n.id)}">
    <span class="ficha__icono">${icono(n.svg, 30)}</span>
    <span class="ficha__texto">${esc(n.nombre)}</span>
  </a>`).join('');

/* Íconos declarados en el HTML con data-icono */
$$('[data-icono]').forEach(el => {
  el.insertAdjacentHTML('afterbegin', icono(el.dataset.icono, Number(el.dataset.tam || 32)));
});

/* ------------------------------------------------------------------ */
/* Cifras del sismo                                                    */
/* ------------------------------------------------------------------ */
$('#contexto').innerHTML = [
  [CIFRAS_EVENTO.magnitud, 'Magnitud del sismo'],
  [CIFRAS_EVENTO.municipios, 'Municipios afectados'],
  [CIFRAS_EVENTO.familias, 'Familias afectadas'],
  [CIFRAS_EVENTO.personas, 'Personas afectadas']
].map(([n, t]) => `
  <div class="cifra-grande">
    <div class="cifra-grande__num">${esc(n)}</div>
    <div class="cifra-grande__etq">${esc(t)}</div>
  </div>`).join('');

$('#fuente-contexto').textContent =
  `Epicentro: ${CIFRAS_EVENTO.epicentro} · ${CIFRAS_EVENTO.fecha}. Fuente: ${CIFRAS_EVENTO.fuente}.`;

/* ------------------------------------------------------------------ */
/* Cifras de la plataforma                                             */
/* ------------------------------------------------------------------ */
traerEstadisticas().then(e => {
  const filas = [
    [e.profesionales, 'Profesionales inscritos'],
    [e.voluntarios, 'Voluntarios disponibles'],
    [e.casos_abiertos, 'Familias esperando'],
    [e.apadrinamientos, 'Casos apadrinados']
  ];
  $('#cifras-plataforma').innerHTML = filas.map(([n, t]) => `
    <div class="cifra">
      <div class="cifra__num">${esc(n ?? 0)}</div>
      <div class="cifra__etq">${esc(t)}</div>
    </div>`).join('');
}).catch(() => { $('#cifras-plataforma').innerHTML = ''; });

/* ------------------------------------------------------------------ */
/* Familias esperando padrino                                          */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Navegación por pantallas                                            */
/* ------------------------------------------------------------------ */
const pantallas = $$('.pantalla');

/* Botones "siga bajando" */
$$('[data-ir]').forEach(b => b.addEventListener('click', () => {
  const destino = $(b.dataset.ir);
  if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

/* Puntos laterales */
if (pantallas.length > 1) {
  const nav = document.createElement('nav');
  nav.className = 'puntos';
  nav.setAttribute('aria-label', 'Ir a una sección');
  nav.innerHTML = pantallas.map((s, i) => `
    <button type="button" data-destino="${esc(s.id)}"
            aria-label="${esc(s.dataset.pantalla || 'Sección ' + (i + 1))}"
            title="${esc(s.dataset.pantalla || '')}"></button>`).join('');
  document.body.appendChild(nav);

  $$('button', nav).forEach(b => b.addEventListener('click', () => {
    const destino = document.getElementById(b.dataset.destino);
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      $$('button', nav).forEach(b =>
        b.setAttribute('aria-current', String(b.dataset.destino === e.target.id)));
      nav.classList.toggle('sobre-oscuro', e.target.dataset.tono === 'oscuro');
    });
  }, { threshold: 0.55 });

  pantallas.forEach(s => observador.observe(s));
}

/* Flechas del teclado para moverse entre pantallas */
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select')) return;
  const actual = pantallas.findIndex(s => {
    const r = s.getBoundingClientRect();
    return r.top <= window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
  });
  if (actual < 0) return;
  if (e.key === 'PageDown' && pantallas[actual + 1]) {
    e.preventDefault(); pantallas[actual + 1].scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'PageUp' && pantallas[actual - 1]) {
    e.preventDefault(); pantallas[actual - 1].scrollIntoView({ behavior: 'smooth' });
  }
});
