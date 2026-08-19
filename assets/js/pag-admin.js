/* SOS por Colombia · Panel de moderación */

import {
  montarBase, $, $$, esc, fecha, aviso, vacio, cargando, modal, leerFormulario, validar, ocupar
} from './ui.js';
import {
  sesion, capturarSesionDeUrl, enviarEnlaceAcceso, traerTodo, cambiarEstado, eliminar
} from './api.js';
import { M_PROFESIONES, M_NECESIDADES, M_HABILIDADES, M_TIPOS_PUNTO, nombreDe } from './datos.js';
import { MODO_DEMO } from './config.js';

montarBase();

const acceso  = $('#acceso');
const panel   = $('#panel');
const contenido = $('#contenido');

let TABLA  = 'casos';
let ESTADO = 'pendiente';

/* ---------------- Sesión ---------------- */
capturarSesionDeUrl();

function estaDentro() {
  return MODO_DEMO || sesion.vigente();
}

function refrescarAcceso() {
  const dentro = estaDentro();
  acceso.classList.toggle('oculto', dentro);
  panel.classList.toggle('oculto', !dentro);
  $('#salir').classList.toggle('oculto', !dentro);
  const s = sesion.leer();
  $('#quien').textContent = MODO_DEMO
    ? 'Modo demostración · los cambios no se guardan'
    : (s && s.email ? s.email : '');
  if (dentro) cargar();
}

$('#form-acceso').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!validar(form)) return;
  const boton = form.querySelector('button[type=submit]');
  const restaurar = ocupar(boton, 'Enviando…');
  try {
    await enviarEnlaceAcceso(leerFormulario(form).email);
    restaurar();
    aviso('Le enviamos un enlace de acceso. Revise su correo.', 'ok');
  } catch (err) {
    restaurar();
    aviso('No fue posible enviar el enlace: ' + err.message, 'error');
  }
});

$('#salir').addEventListener('click', () => { sesion.borrar(); location.reload(); });

/* ---------------- Pestañas ---------------- */
$$('#pestanas button').forEach(b => b.addEventListener('click', () => {
  TABLA = b.dataset.tabla;
  $$('#pestanas button').forEach(x => {
    x.classList.toggle('boton--primario', x === b);
    x.classList.toggle('boton--linea', x !== b);
  });
  $('#estados').classList.toggle('oculto', TABLA === 'apadrinamientos');
  cargar();
}));

$$('#estados button').forEach(b => b.addEventListener('click', () => {
  ESTADO = b.dataset.estado;
  $$('#estados button').forEach(x => {
    x.classList.toggle('boton--primario', x === b);
    x.classList.toggle('boton--linea', x !== b);
  });
  cargar();
}));

/* ---------------- Carga ---------------- */
async function cargar() {
  contenido.innerHTML = cargando('Cargando…');
  try {
    const filas = await traerTodo(TABLA, TABLA === 'apadrinamientos' ? {} : { estado: ESTADO || undefined });
    pintarResumen();
    contenido.innerHTML = filas.length ? tabla(filas) : vacio('No hay registros con ese filtro', '', '📋');
    conectarAcciones();
  } catch (e) {
    contenido.innerHTML = vacio('No fue posible cargar los datos',
      e.message + '. Verifique que su correo esté en la tabla admins.', '⚠️');
  }
}

async function pintarResumen() {
  try {
    const [casos, prof, vol] = await Promise.all([
      traerTodo('casos', { estado: 'pendiente' }),
      traerTodo('profesionales', { estado: 'pendiente' }),
      traerTodo('voluntarios', { estado: 'pendiente' })
    ]);
    const aprob = await traerTodo('casos', { estado: 'aprobado' });
    $('#resumen').innerHTML = [
      ['Casos por revisar', casos.length, 'rojo'],
      ['Profesionales por revisar', prof.length, ''],
      ['Voluntarios por revisar', vol.length, 'dorado'],
      ['Casos publicados', aprob.length, 'verde']
    ].map(([t, n, c]) => `
      <div class="tarjeta" style="padding:18px">
        <div class="icono-caja ${c ? 'icono-caja--' + c : ''}" style="margin-bottom:8px">${n}</div>
        <div style="font-size:.85rem;color:var(--ink-2)">${esc(t)}</div>
      </div>`).join('');
  } catch { /* silencioso */ }
}

/* ---------------- Tabla ---------------- */
function tabla(filas) {
  const cols = {
    casos: ['Código', 'Caso', 'Ubicación', 'Contacto', 'Necesidades', 'Recibido'],
    profesionales: ['Nombre', 'Profesión', 'Contacto', 'Atiende en', 'Aporta', 'Recibido'],
    voluntarios: ['Nombre', 'Oficio', 'Contacto', 'Puede ir a', 'Habilidades', 'Recibido'],
    apadrinamientos: ['Padrino', 'Caso', 'Contacto', 'Compromiso', 'Estado', 'Recibido'],
    puntos_ayuda: ['Punto', 'Tipo', 'Ubicación', 'Contacto', 'Notas', 'Recibido']
  }[TABLA];

  return `<div class="tabla-envoltura"><table>
    <thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}<th>Acciones</th></tr></thead>
    <tbody>${filas.map(fila).join('')}</tbody>
  </table></div>`;
}

function fila(r) {
  const acciones = `
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${TABLA === 'apadrinamientos' ? `
        <button class="boton boton--primario boton--pequeno" data-accion="activo" data-id="${esc(r.id)}">Activar</button>
        <button class="boton boton--linea boton--pequeno" data-accion="completado" data-id="${esc(r.id)}">Cumplido</button>
        <button class="boton boton--linea boton--pequeno" data-accion="cancelado" data-id="${esc(r.id)}">Cancelar</button>
      ` : `
        ${r.estado !== 'aprobado' ? `<button class="boton boton--primario boton--pequeno" data-accion="aprobado" data-id="${esc(r.id)}">Aprobar</button>` : ''}
        ${TABLA === 'casos' && r.estado === 'aprobado' ? `<button class="boton boton--dorado boton--pequeno" data-accion="resuelto" data-id="${esc(r.id)}">Resuelto</button>` : ''}
        ${r.estado !== 'rechazado' ? `<button class="boton boton--linea boton--pequeno" data-accion="rechazado" data-id="${esc(r.id)}">Rechazar</button>` : ''}
      `}
      <button class="boton boton--linea boton--pequeno" data-ver="${esc(r.id)}">Ver</button>
    </div>`;

  const contacto = [r.telefono, r.email].filter(Boolean).map(esc).join('<br>') || '—';

  if (TABLA === 'casos') return `<tr data-fila='${esc(JSON.stringify(r))}'>
    <td><strong>${esc(r.codigo || '')}</strong><br><span class="etq etq--${esc(r.urgencia)}">${esc(r.urgencia)}</span></td>
    <td style="max-width:280px"><strong>${esc(r.titulo)}</strong><br>
        <span style="color:var(--ink-3);font-size:.82rem">${esc((r.historia || '').slice(0, 110))}…</span></td>
    <td>${esc(r.municipio || '')}<br><span style="color:var(--ink-3)">${esc(r.departamento || '')}</span></td>
    <td>${esc(r.nombre_contacto || '')}<br>${contacto}</td>
    <td>${(r.necesidades || []).map(n => `<span class="pastilla">${esc(nombreDe(M_NECESIDADES, n))}</span>`).join('')}</td>
    <td>${esc(fecha(r.creado_en))}</td>
    <td>${acciones}</td></tr>`;

  if (TABLA === 'profesionales') return `<tr data-fila='${esc(JSON.stringify(r))}'>
    <td><strong>${esc(r.nombre)}</strong>${r.matricula ? `<br><span style="color:var(--ink-3);font-size:.8rem">Mat. ${esc(r.matricula)}</span>` : ''}</td>
    <td>${esc(nombreDe(M_PROFESIONES, r.profesion, r.otra_profesion))}</td>
    <td>${contacto}</td>
    <td>${esc((r.zonas_atencion || []).join(', '))}</td>
    <td>${(r.servicios || []).slice(0, 3).map(s => `<span class="pastilla">${esc(s)}</span>`).join('')}</td>
    <td>${esc(fecha(r.creado_en))}</td>
    <td>${acciones}</td></tr>`;

  if (TABLA === 'voluntarios') return `<tr data-fila='${esc(JSON.stringify(r))}'>
    <td><strong>${esc(r.nombre)}</strong></td>
    <td>${esc(r.oficio || '—')}</td>
    <td>${contacto}</td>
    <td>${esc((r.zonas_atencion || []).join(', '))}</td>
    <td>${(r.habilidades || []).slice(0, 3).map(h => `<span class="pastilla">${esc(nombreDe(M_HABILIDADES, h))}</span>`).join('')}</td>
    <td>${esc(fecha(r.creado_en))}</td>
    <td>${acciones}</td></tr>`;

  if (TABLA === 'apadrinamientos') return `<tr data-fila='${esc(JSON.stringify(r))}'>
    <td><strong>${esc(r.nombre)}</strong><br><span style="color:var(--ink-3);font-size:.82rem">${esc(r.perfil)}</span></td>
    <td>${esc(r.caso_id || '')}</td>
    <td>${contacto}</td>
    <td style="max-width:300px">${esc(r.compromiso || '')}</td>
    <td><span class="etq etq--neutra">${esc(r.estado)}</span></td>
    <td>${esc(fecha(r.creado_en))}</td>
    <td>${acciones}</td></tr>`;

  return `<tr data-fila='${esc(JSON.stringify(r))}'>
    <td><strong>${esc(r.nombre)}</strong></td>
    <td>${esc(nombreDe(M_TIPOS_PUNTO, r.tipo))}</td>
    <td>${esc(r.municipio || '')}, ${esc(r.departamento || '')}</td>
    <td>${esc(r.telefono || '—')}</td>
    <td style="max-width:280px">${esc(r.notas || '')}</td>
    <td>${esc(fecha(r.creado_en))}</td>
    <td>${acciones}</td></tr>`;
}

/* ---------------- Acciones ---------------- */
function conectarAcciones() {
  $$('[data-accion]').forEach(b => b.addEventListener('click', async () => {
    const nuevo = b.dataset.accion;
    const restaurar = ocupar(b, '…');
    try {
      await cambiarEstado(TABLA, b.dataset.id, nuevo);
      aviso(MODO_DEMO ? 'Modo demostración: no se guardó.' : `Registro marcado como "${nuevo}".`, MODO_DEMO ? '' : 'ok');
      if (!MODO_DEMO) cargar(); else restaurar();
    } catch (e) { restaurar(); aviso('Error: ' + e.message, 'error'); }
  }));

  $$('[data-ver]').forEach(b => b.addEventListener('click', () => {
    const r = JSON.parse(b.closest('tr').dataset.fila);
    const filas = Object.entries(r)
      .filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => `<div class="dato"><dt>${esc(k)}</dt><dd style="text-align:left;max-width:60%">${
        esc(Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v))}</dd></div>`).join('');
    modal(`<h2 style="font-size:1.2rem">Detalle del registro</h2><dl style="margin:0">${filas}</dl>`);
  }));
}

refrescarAcceso();
