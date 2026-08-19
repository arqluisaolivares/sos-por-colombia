/* SOS por Colombia · Directorio e inscripción de profesionales */

import {
  montarBase, $, $$, esc, vacio, cargando, aviso, modal, casillas, opcionesSelect,
  leerFormulario, validar, ocupar
} from './ui.js';
import { traerProfesionales, registrarProfesional } from './api.js';
import { tarjetaProfesional } from './componentes.js';
import {
  DEPARTAMENTOS, DEPARTAMENTOS_AFECTADOS, PROFESIONES, SERVICIOS, MODALIDADES,
  DISPONIBILIDADES, serviciosDe
} from './datos.js';
import { MODO_DEMO } from './config.js';

montarBase();

/* ---------------- Pestañas ---------------- */
const paneles = ['panel-directorio', 'panel-inscripcion'];

function abrirPestana(id) {
  paneles.forEach(p => $('#' + p).classList.toggle('oculto', p !== id));
  $$('.pestana').forEach(b => {
    const activa = b.dataset.panel === id;
    b.classList.toggle('pestana--activa', activa);
    b.setAttribute('aria-selected', String(activa));
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('.pestana').forEach(b => b.addEventListener('click', () => abrirPestana(b.dataset.panel)));

/* Los enlaces #inscribirme de todo el sitio abren directamente el formulario */
if (location.hash === '#inscribirme') abrirPestana('panel-inscripcion');
window.addEventListener('hashchange', () => {
  if (location.hash === '#inscribirme') abrirPestana('panel-inscripcion');
});

/* ---------------- Directorio ---------------- */
const lista = $('#lista');
const conteo = $('#conteo');
const filtros = $('#filtros');

$('#f-profesion').innerHTML    = opcionesSelect(PROFESIONES, '', 'Todas');
$('#f-servicio').innerHTML     = opcionesSelect(SERVICIOS, '', 'Todos');
$('#f-departamento').innerHTML = opcionesSelect(DEPARTAMENTOS, '', 'Todo el país');

let TODOS = [];

async function cargar() {
  lista.innerHTML = cargando('Cargando profesionales…');
  try { TODOS = await traerProfesionales(); pintar(); }
  catch (e) { lista.innerHTML = vacio('No fue posible cargar el directorio', e.message, '⚠️'); }
}

function pintar() {
  const t = $('#f-busqueda').value.trim().toLowerCase();
  const profesion = $('#f-profesion').value;
  const servicio  = $('#f-servicio').value;
  const depto     = $('#f-departamento').value;

  const r = TODOS.filter(p => {
    if (profesion && p.profesion !== profesion) return false;
    if (servicio && !(p.servicios || []).includes(servicio)) return false;
    if (depto && p.departamento !== depto && !(p.zonas_atencion || []).includes(depto)) return false;
    if (t && !`${p.nombre} ${p.descripcion || ''} ${p.ciudad || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });

  conteo.textContent = r.length === 1 ? '1 profesional inscrito' : `${r.length} profesionales inscritos`;
  const cuenta = $('#cuenta-inscritos');
  if (cuenta) cuenta.textContent = TODOS.length;
  lista.innerHTML = r.length
    ? r.map(tarjetaProfesional).join('')
    : vacio('Todavía no hay profesionales con ese perfil',
            'Si usted lo es, inscríbase más abajo: hace falta.', '📐');
}

filtros.addEventListener('input', pintar);
filtros.addEventListener('change', pintar);
$('#limpiar').addEventListener('click', () => { filtros.reset(); pintar(); });
cargar();

/* ---------------- Inscripción ---------------- */
$('#profesion').innerHTML       = opcionesSelect(PROFESIONES, '', 'Seleccione');
$('#departamento').innerHTML    = opcionesSelect(DEPARTAMENTOS, '', 'Seleccione');
$('#modalidad').innerHTML       = opcionesSelect(MODALIDADES, 'mixta', 'Seleccione');
$('#disponibilidad').innerHTML  = opcionesSelect(DISPONIBILIDADES, '', 'Seleccione');
pintarServicios('');
$('#opc-zonas').innerHTML       = casillas('zonas_atencion',
  DEPARTAMENTOS.map(d => ({ id: d, nombre: DEPARTAMENTOS_AFECTADOS.includes(d) ? `${d} ★` : d })));

$('#profesion').addEventListener('change', e => {
  $('#campo-otra').classList.toggle('oculto', e.target.value !== 'otra');
  pintarServicios(e.target.value);
});

$('#ver-todos-servicios').addEventListener('click', () => pintarServicios('', true));

/**
 * Muestra las formas de ayudar que corresponden a la profesión escogida.
 * Si no hay profesión, o si el usuario pide ver todas, muestra el catálogo completo.
 */
function pintarServicios(profesion, todas = false) {
  const sugeridos = todas ? [] : serviciosDe(profesion);
  const lista = sugeridos.length ? sugeridos : SERVICIOS;
  const marcados = $$('#opc-servicios input:checked').map(i => i.value);

  $('#opc-servicios').innerHTML = casillas('servicios', lista, marcados);

  const ayuda = $('#ayuda-servicios');
  const boton = $('#ver-todos-servicios');
  if (sugeridos.length) {
    const nombre = (PROFESIONES.find(p => p.id === profesion) || {}).nombre || '';
    ayuda.textContent = `Formas de ayudar más frecuentes en ${nombre.toLowerCase()}. Marque las que pueda cumplir.`;
    boton.classList.remove('oculto');
  } else {
    ayuda.textContent = profesion || todas
      ? 'Todas las formas de ayudar. Marque las que pueda cumplir.'
      : 'Escoja primero su profesión y le mostramos las formas de ayudar que corresponden.';
    boton.classList.add('oculto');
  }
}

const form = $('#form-profesional');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar(form, {
    zonas_atencion: 'Escoja al menos un departamento donde pueda atender',
    servicios: 'Escoja al menos un aporte'
  })) return;

  const boton = form.querySelector('button[type=submit]');
  const restaurar = ocupar(boton, 'Enviando…');
  const d = leerFormulario(form);

  try {
    await registrarProfesional({
      nombre: d.nombre,
      profesion: d.profesion,
      otra_profesion: d.otra_profesion || null,
      matricula: d.matricula || null,
      anos_experiencia: d.anos_experiencia ? Number(d.anos_experiencia) : null,
      email: d.email,
      telefono: d.telefono,
      ciudad: d.ciudad || null,
      departamento: d.departamento || null,
      zonas_atencion: [].concat(d.zonas_atencion || []),
      modalidad: d.modalidad || null,
      disponibilidad: d.disponibilidad || null,
      servicios: [].concat(d.servicios || []),
      descripcion: d.descripcion || null,
      enlace: d.enlace || null,
      autoriza_datos: true
    });

    form.reset();
    $('#campo-otra').classList.add('oculto');
    restaurar();

    modal(`
      <div style="text-align:center;padding:10px 0">
        <div style="font-size:2.8rem">📐</div>
        <h2 style="font-size:1.35rem">Gracias por inscribirse</h2>
        <p style="color:var(--ink-2)">
          Verificaremos su información y le escribiremos a <strong>${esc(d.email)}</strong>.
          Una vez aprobada la inscripción podrá apadrinar casos con ese mismo correo.
        </p>
        ${MODO_DEMO ? `<div class="aviso aviso--alerta" style="text-align:left"><span class="aviso__icono">⚠️</span>
          <div>Modo demostración: la inscripción <strong>no se guardó</strong>.</div></div>` : ''}
        <a class="boton boton--primario" href="casos.html">Ver familias que buscan padrino</a>
      </div>`);
  } catch (err) {
    restaurar();
    aviso('No fue posible enviar la inscripción: ' + err.message, 'error');
  }
});
