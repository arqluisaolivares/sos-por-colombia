/* SOS por Colombia · Listado de casos */

import { montarBase, $, opcionesSelect, vacio, cargando, parametro } from './ui.js';
import { traerCasos, filtrarCasos } from './api.js';
import { tarjetaCaso } from './componentes.js';
import { DEPARTAMENTOS, NECESIDADES } from './datos.js';

montarBase();

const form  = $('#filtros');
const lista = $('#lista');
const conteo = $('#conteo');

$('#f-departamento').innerHTML = opcionesSelect(DEPARTAMENTOS, parametro('departamento') || '', 'Todos');
$('#f-necesidad').innerHTML    = opcionesSelect(
  NECESIDADES.map(n => ({ id: n.id, nombre: `${n.icono} ${n.nombre}` })), parametro('necesidad') || '', 'Todas');
if (parametro('urgencia')) $('#f-urgencia').value = parametro('urgencia');
if (parametro('busqueda')) $('#f-busqueda').value = parametro('busqueda');

let TODOS = [];

async function cargar() {
  lista.innerHTML = cargando('Cargando casos…');
  try {
    TODOS = await traerCasos();
    pintar();
  } catch (e) {
    lista.innerHTML = vacio('No fue posible cargar los casos', e.message, '⚠️');
    conteo.textContent = '';
  }
}

function pintar() {
  const f = {
    busqueda:     $('#f-busqueda').value,
    departamento: $('#f-departamento').value,
    necesidad:    $('#f-necesidad').value,
    urgencia:     $('#f-urgencia').value
  };
  let r = filtrarCasos(TODOS, f);

  const estado = $('#f-estado').value;
  if (estado === 'sin_padrino') r = r.filter(c => !(c.padrinos || []).length && c.estado !== 'resuelto');
  if (estado === 'apadrinado')  r = r.filter(c => (c.padrinos || []).length && c.estado !== 'resuelto');
  if (estado === 'resuelto')    r = r.filter(c => c.estado === 'resuelto');

  // Los casos sin padrino y de urgencia alta se muestran primero
  const peso = { alta: 0, media: 1, baja: 2 };
  r.sort((a, b) => {
    const pa = (a.padrinos || []).length ? 1 : 0, pb = (b.padrinos || []).length ? 1 : 0;
    if (pa !== pb) return pa - pb;
    const ua = peso[a.urgencia] ?? 3, ub = peso[b.urgencia] ?? 3;
    if (ua !== ub) return ua - ub;
    return new Date(b.creado_en || 0) - new Date(a.creado_en || 0);
  });

  conteo.textContent = r.length === 1
    ? '1 caso encontrado'
    : `${r.length} casos encontrados`;

  lista.innerHTML = r.length
    ? r.map(tarjetaCaso).join('')
    : vacio('Ningún caso coincide con los filtros', 'Pruebe ampliando la búsqueda o limpiando los filtros.');
}

form.addEventListener('input', pintar);
form.addEventListener('change', pintar);
$('#limpiar').addEventListener('click', () => { form.reset(); pintar(); });

cargar();
