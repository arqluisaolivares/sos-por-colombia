/* SOS por Colombia · Directorio e inscripción de voluntarios */

import {
  montarBase, $, esc, vacio, cargando, aviso, modal, casillas, opcionesSelect,
  leerFormulario, validar, ocupar
} from './ui.js';
import { traerVoluntarios, registrarVoluntario } from './api.js';
import { tarjetaVoluntario } from './componentes.js';
import { DEPARTAMENTOS, DEPARTAMENTOS_AFECTADOS, HABILIDADES, DISPONIBILIDADES } from './datos.js';
import { MODO_DEMO } from './config.js';

montarBase();

/* ---------------- Directorio ---------------- */
const lista = $('#lista');
const conteo = $('#conteo');
const filtros = $('#filtros');

$('#f-habilidad').innerHTML    = opcionesSelect(HABILIDADES, '', 'Todas');
$('#f-departamento').innerHTML = opcionesSelect(DEPARTAMENTOS, '', 'Todo el país');

let TODOS = [];

async function cargar() {
  lista.innerHTML = cargando('Cargando voluntarios…');
  try { TODOS = await traerVoluntarios(); pintar(); }
  catch (e) { lista.innerHTML = vacio('No fue posible cargar el directorio', e.message, '⚠️'); }
}

function pintar() {
  const t = $('#f-busqueda').value.trim().toLowerCase();
  const hab = $('#f-habilidad').value;
  const depto = $('#f-departamento').value;

  const r = TODOS.filter(v => {
    if (hab && !(v.habilidades || []).includes(hab)) return false;
    if (depto && v.departamento !== depto && !(v.zonas_atencion || []).includes(depto)) return false;
    if (t && !`${v.nombre} ${v.oficio || ''} ${v.descripcion || ''} ${v.ciudad || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });

  conteo.textContent = r.length === 1 ? '1 voluntario disponible' : `${r.length} voluntarios disponibles`;
  lista.innerHTML = r.length
    ? r.map(tarjetaVoluntario).join('')
    : vacio('Todavía no hay voluntarios con ese perfil', 'Inscríbase más abajo: cualquier oficio sirve.', '🤝');
}

filtros.addEventListener('input', pintar);
filtros.addEventListener('change', pintar);
$('#limpiar').addEventListener('click', () => { filtros.reset(); pintar(); });
cargar();

/* ---------------- Inscripción ---------------- */
$('#departamento').innerHTML   = opcionesSelect(DEPARTAMENTOS, '', 'Seleccione');
$('#disponibilidad').innerHTML = opcionesSelect(DISPONIBILIDADES, '', 'Seleccione');
$('#opc-habilidades').innerHTML = casillas('habilidades', HABILIDADES);
$('#opc-zonas').innerHTML = casillas('zonas_atencion',
  DEPARTAMENTOS.map(d => ({ id: d, nombre: DEPARTAMENTOS_AFECTADOS.includes(d) ? `${d} ★` : d })));

const form = $('#form-voluntario');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar(form, {
    habilidades: 'Marque al menos una habilidad',
    zonas_atencion: 'Escoja al menos un departamento'
  })) return;

  const boton = form.querySelector('button[type=submit]');
  const restaurar = ocupar(boton, 'Enviando…');
  const d = leerFormulario(form);

  try {
    await registrarVoluntario({
      nombre: d.nombre,
      oficio: d.oficio || null,
      habilidades: [].concat(d.habilidades || []),
      otra_habilidad: d.otra_habilidad || null,
      email: d.email,
      telefono: d.telefono,
      ciudad: d.ciudad || null,
      departamento: d.departamento || null,
      zonas_atencion: [].concat(d.zonas_atencion || []),
      disponibilidad: d.disponibilidad || null,
      tiene_vehiculo: !!(d.tipo_vehiculo && String(d.tipo_vehiculo).trim()),
      tipo_vehiculo: d.tipo_vehiculo || null,
      mayor_de_edad: true,
      descripcion: d.descripcion || null,
      autoriza_datos: true
    });

    form.reset();
    restaurar();

    modal(`
      <div style="text-align:center;padding:10px 0">
        <div style="font-size:2.8rem">🤝</div>
        <h2 style="font-size:1.35rem">Bienvenido al equipo</h2>
        <p style="color:var(--ink-2)">
          Le escribiremos a <strong>${esc(d.email)}</strong> cuando haya una jornada donde su ayuda encaje.
        </p>
        ${MODO_DEMO ? `<div class="aviso aviso--alerta" style="text-align:left"><span class="aviso__icono">⚠️</span>
          <div>Modo demostración: la inscripción <strong>no se guardó</strong>.</div></div>` : ''}
        <a class="boton boton--primario" href="casos.html">Ver familias que necesitan ayuda</a>
      </div>`);
  } catch (err) {
    restaurar();
    aviso('No fue posible enviar la inscripción: ' + err.message, 'error');
  }
});
