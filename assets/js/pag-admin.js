/* SOS por Colombia · Panel de moderación */

import {
  montarBase, $, $$, esc, fecha, aviso, vacio, cargando, modal, leerFormulario, validar, ocupar
} from './ui.js';
import {
  sesion, capturarSesionDeUrl, enviarEnlaceAcceso, traerTodo, cambiarEstado, eliminar, marcarAvisado
} from './api.js';
import {
  abrir as abrirWhatsApp, esWhatsApp, mostrar as mostrarTelefono,
  mensajeFamiliaApadrinada, mensajeProfesional, mensajeCasoAprobado,
  mensajeInscripcionAprobada, mensajeResumenEquipo, mensajeInvitacion
} from './whatsapp.js';
import { M_PROFESIONES, M_NECESIDADES, M_HABILIDADES, M_TIPOS_PUNTO, M_SERVICIOS, nombreDe } from './datos.js';
import { MODO_DEMO } from './config.js';

montarBase();

const acceso  = $('#acceso');
const panel   = $('#panel');
const contenido = $('#contenido');

let TABLA  = 'casos';
let ESTADO = 'pendiente';
let CASOS_POR_ID = {};

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
  $('#resumen-equipo').classList.toggle('oculto', !dentro);
  $('#exportar').classList.toggle('oculto', !dentro);
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
    if (TABLA === 'apadrinamientos' && !Object.keys(CASOS_POR_ID).length) {
      const todos = await traerTodo('casos', {});
      CASOS_POR_ID = Object.fromEntries(todos.map(c => [c.id, c]));
    }
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

function botonesWhatsApp(r) {
  if (TABLA === 'apadrinamientos') {
    const caso = CASOS_POR_ID[r.caso_id];
    const bf = (caso && esWhatsApp(caso.telefono))
      ? `<button class="boton boton--whatsapp boton--pequeno" data-wa="familia" data-id="${esc(r.id)}">Avisar familia</button>` : '';
    const bp = esWhatsApp(r.telefono)
      ? `<button class="boton boton--whatsapp boton--pequeno" data-wa="profesional" data-id="${esc(r.id)}">Avisar padrino</button>` : '';
    return bf + bp;
  }
  if (TABLA === 'casos') {
    return (esWhatsApp(r.telefono)
      ? `<button class="boton boton--whatsapp boton--pequeno" data-wa="caso" data-id="${esc(r.id)}">Avisar familia</button>` : '')
      + `<button class="boton boton--dorado boton--pequeno" data-buscar="${esc(r.id)}">Buscar profesional</button>`;
  }
  if (TABLA === 'profesionales' || TABLA === 'voluntarios') {
    return esWhatsApp(r.telefono)
      ? `<button class="boton boton--whatsapp boton--pequeno" data-wa="inscripcion" data-id="${esc(r.id)}">Avisar</button>` : '';
  }
  return '';
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
      ${botonesWhatsApp(r)}
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

  $$('[data-wa]').forEach(b => b.addEventListener('click', () => {
    const r = JSON.parse(b.closest('tr').dataset.fila);
    const tipo = b.dataset.wa;
    let ok = false;

    if (tipo === 'caso') {
      ok = abrirWhatsApp(r.telefono, mensajeCasoAprobado(r, enlaceCaso(r)));
      if (ok) marcarAvisado('casos', r.id, 'avisado_en');
    }
    if (tipo === 'inscripcion') {
      const perfil = TABLA === 'profesionales' ? 'profesional' : 'voluntario';
      ok = abrirWhatsApp(r.telefono, mensajeInscripcionAprobada(r, perfil));
      if (ok) marcarAvisado(TABLA, r.id, 'avisado_en');
    }
    if (tipo === 'familia') {
      const caso = CASOS_POR_ID[r.caso_id];
      if (caso) {
        ok = abrirWhatsApp(caso.telefono, mensajeFamiliaApadrinada(caso, r));
        if (ok) marcarAvisado('apadrinamientos', r.id, 'aviso_familia_en');
      }
    }
    if (tipo === 'profesional') {
      const caso = CASOS_POR_ID[r.caso_id];
      if (caso) {
        ok = abrirWhatsApp(r.telefono, mensajeProfesional(caso, r));
        if (ok) marcarAvisado('apadrinamientos', r.id, 'aviso_profesional_en');
      }
    }

    if (ok) {
      b.textContent = 'Enviado ✓';
      b.classList.remove('boton--whatsapp');
      b.classList.add('boton--linea');
    } else {
      aviso('Ese número no sirve para WhatsApp. Revíselo en la ficha del registro.', 'error');
    }
  }));

  $$('[data-buscar]').forEach(b => b.addEventListener('click', () => {
    const caso = JSON.parse(b.closest('tr').dataset.fila);
    abrirBuscador(caso);
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


/* ---------------- Buscar un profesional para un caso ---------------- */
async function abrirBuscador(caso) {
  const { cerrar } = modal(`
    <h2 style="font-size:1.25rem">Buscar profesional para ${esc(caso.codigo)}</h2>
    <p style="font-size:.92rem;color:var(--ink-2)">${esc(caso.titulo)}</p>
    <div class="pastillas" style="margin-bottom:16px">
      ${(caso.necesidades || []).map(n => `<span class="pastilla">${esc(nombreDe(M_NECESIDADES, n))}</span>`).join('')}
      <span class="pastilla">${esc(caso.departamento || '')}</span>
    </div>
    <div class="filtros" style="grid-template-columns:1fr auto;margin-bottom:16px">
      <div class="campo">
        <label for="bp-busqueda">Buscar por nombre o especialidad</label>
        <input type="text" id="bp-busqueda" placeholder="arquitecto, estructural…">
      </div>
      <div class="campo">
        <label class="opcion" style="min-height:auto;padding:12px 14px">
          <input type="checkbox" id="bp-zona" checked>
          <span>Solo los que atienden en ${esc(caso.departamento || 'esa zona')}</span>
        </label>
      </div>
    </div>
    <div id="bp-lista">${cargando('Buscando profesionales…')}</div>
  `);

  let TODOS = [];
  try {
    TODOS = (await traerTodo('profesionales', { estado: 'aprobado' })) || [];
  } catch (e) {
    $('#bp-lista').innerHTML = vacio('No fue posible cargar el directorio', e.message, '⚠️');
    return;
  }

  const url = enlaceCaso(caso);

  function pintarLista() {
    const t = $('#bp-busqueda').value.trim().toLowerCase();
    const soloZona = $('#bp-zona').checked;

    let r = TODOS.slice();
    if (soloZona && caso.departamento) {
      r = r.filter(p => (p.zonas_atencion || []).includes(caso.departamento) ||
                        p.departamento === caso.departamento);
    }
    if (t) {
      r = r.filter(p => `${p.nombre} ${nombreDe(M_PROFESIONES, p.profesion, p.otra_profesion)} ${(p.servicios || []).map(x => nombreDe(M_SERVICIOS, x)).join(' ')} ${p.descripcion || ''}`
        .toLowerCase().includes(t));
    }

    // Los que ya atienden algo parecido a lo que el caso pide van primero
    const pedido = new Set(caso.necesidades || []);
    const afin = (p) => (p.servicios || []).filter(sv =>
      (sv === 'planos' && pedido.has('planos')) ||
      (sv === 'evaluacion_estructural' && pedido.has('evaluacion')) ||
      (sv === 'salud' && pedido.has('salud')) ||
      (sv === 'apoyo_psicologico' && pedido.has('psicologico')) ||
      (sv === 'asesoria_juridica' && pedido.has('juridico')) ||
      (sv === 'direccion_obra' && pedido.has('mano_obra'))).length;
    r.sort((a, b) => afin(b) - afin(a));

    $('#bp-lista').innerHTML = r.length ? r.map(p => {
      const puede = esWhatsApp(p.telefono);
      return `
      <div class="tarjeta" style="margin-bottom:10px;padding:16px">
        <div style="display:flex;gap:12px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap">
          <div style="flex:1;min-width:180px">
            <strong>${esc(p.nombre)}</strong>${afin(p) ? ' <span class="etq etq--ok">Encaja</span>' : ''}
            <div style="font-size:.85rem;color:var(--navy);font-weight:600">
              ${esc(nombreDe(M_PROFESIONES, p.profesion, p.otra_profesion))}</div>
            <div style="font-size:.82rem;color:var(--ink-3)">
              ${esc(p.ciudad || '')} · ${esc(mostrarTelefono(p.telefono))}</div>
          </div>
          ${puede
            ? `<button class="boton boton--whatsapp boton--pequeno"
                 data-invitar='${esc(JSON.stringify({ nombre: p.nombre, telefono: p.telefono }))}'>Invitar</button>`
            : '<span class="etq etq--neutra">Sin WhatsApp</span>'}
        </div>
      </div>`;
    }).join('') : vacio('Ningún profesional coincide',
        'Pruebe quitando el filtro de zona o inscribiendo más profesionales.', '📐');

    $$('#bp-lista [data-invitar]').forEach(b => b.addEventListener('click', () => {
      const p = JSON.parse(b.dataset.invitar);
      if (abrirWhatsApp(p.telefono, mensajeInvitacion(caso, p, url))) {
        b.textContent = 'Invitado ✓';
        b.classList.remove('boton--whatsapp');
        b.classList.add('boton--linea');
      }
    }));
  }

  $('#bp-busqueda').addEventListener('input', pintarLista);
  $('#bp-zona').addEventListener('change', pintarLista);
  pintarLista();
}

/* ---------------- Descargar a Excel ---------------- */
function aCSV(filas) {
  if (!filas.length) return '';
  const columnas = [...new Set(filas.flatMap(f => Object.keys(f)))];
  const celda = (v) => {
    if (v === null || v === undefined) return '';
    const t = Array.isArray(v) ? v.join(' | ')
            : (typeof v === 'object' ? JSON.stringify(v) : String(v));
    return `"${t.replace(/"/g, '""')}"`;
  };
  return [columnas.join(';'), ...filas.map(f => columnas.map(c => celda(f[c])).join(';'))].join('\r\n');
}

function descargar(nombre, contenido) {
  // El BOM hace que Excel abra bien las tildes y las eñes.
  const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

$('#exportar').addEventListener('click', async (e) => {
  const restaurar = ocupar(e.currentTarget, 'Preparando…');
  const hoy = new Date().toISOString().slice(0, 10);
  try {
    for (const t of ['casos', 'profesionales', 'voluntarios', 'apadrinamientos', 'puntos_ayuda']) {
      const filas = (await traerTodo(t, {})) || [];
      if (filas.length) descargar(`sos-${t}-${hoy}.csv`, aCSV(filas));
    }
    restaurar();
    aviso('Listo. Los archivos se descargaron: ábralos con Excel o súbalos a Drive.', 'ok');
  } catch (err) {
    restaurar();
    aviso('No fue posible exportar: ' + err.message, 'error');
  }
});

function enlaceCaso(c) {
  const base = location.origin + location.pathname.replace(/[^/]*$/, '');
  return `${base}caso.html?id=${encodeURIComponent(c.id)}`;
}

/* ---------------- Resumen para el equipo ---------------- */
$('#resumen-equipo').addEventListener('click', async () => {
  try {
    const [casos, prof, vol, apad] = await Promise.all([
      traerTodo('casos', { estado: 'pendiente' }),
      traerTodo('profesionales', { estado: 'pendiente' }),
      traerTodo('voluntarios', { estado: 'pendiente' }),
      traerTodo('apadrinamientos', {})
    ]);
    const texto = mensajeResumenEquipo({
      casos: casos.length,
      profesionales: prof.length,
      voluntarios: vol.length,
      apadrinamientos: apad.filter(a => a.estado === 'propuesto').length
    });
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  } catch (e) {
    aviso('No fue posible armar el resumen: ' + e.message, 'error');
  }
});

refrescarAcceso();
