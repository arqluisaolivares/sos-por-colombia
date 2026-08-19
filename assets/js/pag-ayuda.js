/* SOS por Colombia · Directorio "¿Dónde consigo ayuda?" */

import {
  montarBase, $, esc, vacio, cargando, aviso, modal, opcionesSelect,
  leerFormulario, validar, ocupar
} from './ui.js';
import { traerPuntosAyuda, proponerPuntoAyuda } from './api.js';
import { DEPARTAMENTOS, TIPOS_PUNTO, M_TIPOS_PUNTO } from './datos.js';
import { MODO_DEMO } from './config.js';

montarBase();

const lista = $('#lista');
const filtros = $('#filtros');

$('#f-tipo').innerHTML = opcionesSelect(
  TIPOS_PUNTO.map(t => ({ id: t.id, nombre: `${t.icono} ${t.nombre}` })), '', 'Todos');
$('#f-departamento').innerHTML = opcionesSelect(['Nacional', ...DEPARTAMENTOS], '', 'Todo el país');

let TODOS = [];

async function cargar() {
  lista.innerHTML = cargando('Cargando puntos de ayuda…');
  try { TODOS = await traerPuntosAyuda(); pintar(); }
  catch (e) { lista.innerHTML = vacio('No fue posible cargar el directorio', e.message, '⚠️'); }
}

function tarjetaPunto(p) {
  const t = M_TIPOS_PUNTO[p.tipo] || { icono: '📍', nombre: p.tipo };
  return `
  <article class="tarjeta">
    <div style="display:flex;gap:14px;align-items:flex-start">
      <div class="icono-caja" style="margin:0;flex-shrink:0">${t.icono}</div>
      <div style="flex:1;min-width:0">
        <span class="etq etq--neutra">${esc(t.nombre)}</span>
        <h3 style="margin:8px 0 3px">${esc(p.nombre)}</h3>
        ${p.entidad ? `<div style="font-size:.84rem;color:var(--navy);font-weight:600">${esc(p.entidad)}</div>` : ''}
        <div style="font-size:.83rem;color:var(--ink-3);margin-top:4px">
          ${esc(p.municipio || '')}${p.departamento && p.departamento !== 'Nacional' ? ', ' + esc(p.departamento) : ''}
          ${p.horario ? ` · ${esc(p.horario)}` : ''}
        </div>
        ${p.direccion ? `<div style="font-size:.86rem;margin-top:8px">📍 ${esc(p.direccion)}</div>` : ''}
        ${p.telefono ? `<div style="font-size:.95rem;margin-top:6px">📞 <a href="tel:${esc(String(p.telefono).replace(/\s/g, ''))}"><strong>${esc(p.telefono)}</strong></a></div>` : ''}
        ${p.notas ? `<p style="font-size:.88rem;color:var(--ink-2);margin:10px 0 0">${esc(p.notas)}</p>` : ''}
        ${p.enlace ? `<a class="boton boton--linea boton--pequeno" style="margin-top:12px" href="${esc(p.enlace)}" target="_blank" rel="noopener">Abrir sitio</a>` : ''}
      </div>
    </div>
  </article>`;
}

function pintar() {
  const t = $('#f-busqueda').value.trim().toLowerCase();
  const tipo = $('#f-tipo').value;
  const depto = $('#f-departamento').value;

  const r = TODOS.filter(p => {
    if (tipo && p.tipo !== tipo) return false;
    if (depto && p.departamento !== depto) return false;
    if (t && !`${p.nombre} ${p.entidad || ''} ${p.municipio || ''} ${p.notas || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });

  lista.innerHTML = r.length
    ? r.map(tarjetaPunto).join('')
    : vacio('Todavía no hay puntos registrados con esos criterios',
            'Si conoce uno, repórtelo con el botón de arriba.', '📍');
}

filtros.addEventListener('input', pintar);
filtros.addEventListener('change', pintar);
$('#limpiar').addEventListener('click', () => { filtros.reset(); pintar(); });
cargar();

/* ---------------- Reportar un punto ---------------- */
$('#btn-proponer').addEventListener('click', () => {
  const { cerrar } = modal(`
    <h2 style="font-size:1.3rem">Reportar un punto de ayuda</h2>
    <p style="font-size:.9rem;color:var(--ink-2)">
      Un moderador lo verifica antes de publicarlo. Reporte solo lo que le conste.
    </p>
    <form id="form-punto" class="formulario" novalidate>
      <div class="campo">
        <label for="pn-nombre">Nombre del punto <span style="color:var(--red)">*</span></label>
        <input type="text" id="pn-nombre" name="nombre" required placeholder="Ejemplo: Punto de acopio Coliseo Municipal">
      </div>
      <div class="campos-fila">
        <div class="campo">
          <label for="pn-tipo">Tipo <span style="color:var(--red)">*</span></label>
          <select id="pn-tipo" name="tipo" required></select>
        </div>
        <div class="campo">
          <label for="pn-entidad">Entidad responsable</label>
          <input type="text" id="pn-entidad" name="entidad">
        </div>
      </div>
      <div class="campos-fila">
        <div class="campo">
          <label for="pn-departamento">Departamento <span style="color:var(--red)">*</span></label>
          <select id="pn-departamento" name="departamento" required></select>
        </div>
        <div class="campo">
          <label for="pn-municipio">Municipio <span style="color:var(--red)">*</span></label>
          <input type="text" id="pn-municipio" name="municipio" required>
        </div>
      </div>
      <div class="campo">
        <label for="pn-direccion">Dirección</label>
        <input type="text" id="pn-direccion" name="direccion">
      </div>
      <div class="campos-fila">
        <div class="campo">
          <label for="pn-horario">Horario</label>
          <input type="text" id="pn-horario" name="horario" placeholder="Ejemplo: lunes a sábado, 8 a. m. a 5 p. m.">
        </div>
        <div class="campo">
          <label for="pn-telefono">Teléfono</label>
          <input type="tel" id="pn-telefono" name="telefono">
        </div>
      </div>
      <div class="campo">
        <label for="pn-notas">¿Qué se consigue ahí?</label>
        <textarea id="pn-notas" name="notas" rows="3"></textarea>
      </div>
      <button class="boton boton--primario boton--ancho" type="submit">Enviar reporte</button>
    </form>
  `);

  $('#pn-tipo').innerHTML = opcionesSelect(TIPOS_PUNTO, '', 'Seleccione');
  $('#pn-departamento').innerHTML = opcionesSelect(['Nacional', ...DEPARTAMENTOS], '', 'Seleccione');

  const form = $('#form-punto');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validar(form)) return;
    const boton = form.querySelector('button[type=submit]');
    const restaurar = ocupar(boton, 'Enviando…');
    const d = leerFormulario(form);
    try {
      await proponerPuntoAyuda({
        nombre: d.nombre, tipo: d.tipo, entidad: d.entidad || null,
        departamento: d.departamento, municipio: d.municipio,
        direccion: d.direccion || null, horario: d.horario || null,
        telefono: d.telefono || null, notas: d.notas || null
      });
      cerrar();
      aviso(MODO_DEMO
        ? 'Modo demostración: el reporte no se guardó.'
        : 'Gracias. El punto quedó en revisión.', MODO_DEMO ? '' : 'ok');
    } catch (err) {
      restaurar();
      aviso('No fue posible enviar el reporte: ' + err.message, 'error');
    }
  });
});
