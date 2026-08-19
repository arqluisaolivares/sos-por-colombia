/* =====================================================================
   SOS POR COLOMBIA · Tarjetas reutilizables
   ===================================================================== */

import { esc, haceCuanto } from './ui.js';
import {
  M_NECESIDADES, M_PROFESIONES, M_HABILIDADES, M_SERVICIOS, M_VIVIENDA, nombreDe
} from './datos.js';
import { icono } from './iconos.js';

const ETQ_URGENCIA = {
  alta:  '<span class="etq etq--alta">Urgencia alta</span>',
  media: '<span class="etq etq--media">Urgencia media</span>',
  baja:  '<span class="etq etq--baja">Urgencia baja</span>'
};

export function tarjetaCaso(c) {
  const foto = (c.fotos && c.fotos.length) ? c.fotos[0].url || c.fotos[0] : null;
  const padrinos = c.padrinos || [];
  const resuelto = c.estado === 'resuelto';

  const necesidades = (c.necesidades || []).slice(0, 4).map(n => {
    const o = M_NECESIDADES[n];
    return `<span class="pastilla">${o ? icono(o.svg, 15, 1.8) + esc(o.nombre) : esc(n)}</span>`;
  }).join('');
  const restantes = (c.necesidades || []).length - 4;

  const pie = resuelto
    ? `<span class="caso__padrino">✓ Caso resuelto</span>`
    : padrinos.length
      ? `<span class="caso__padrino">✓ Apadrinado por ${esc(padrinos[0].nombre)}${padrinos.length > 1 ? ` +${padrinos.length - 1}` : ''}</span>`
      : `<span style="color:var(--ink-3)">Sin padrino todavía</span>`;

  return `
  <article class="tarjeta tarjeta--enlace caso">
    <div class="caso__foto${foto ? '' : ' caso__foto--vacia'}"${foto ? ` style="background-image:url('${esc(foto)}')"` : ''}>
      ${foto ? '' : icono('casa-danada', 44, 1.4)}
      <span class="caso__codigo">${esc(c.codigo || '')}</span>
      <span class="caso__urgencia">${resuelto ? '<span class="etq etq--ok">Resuelto</span>' : (ETQ_URGENCIA[c.urgencia] || '')}</span>
    </div>
    <div class="caso__cuerpo">
      <div class="caso__lugar">${esc(c.municipio || '')}${c.barrio ? ' · ' + esc(c.barrio) : ''}, ${esc(c.departamento || '')} · ${esc(haceCuanto(c.creado_en))}</div>
      <h3 class="caso__titulo">${esc(c.titulo)}</h3>
      <p class="caso__resumen">${esc(c.historia || '')}</p>
      <div class="pastillas">${necesidades}${restantes > 0 ? `<span class="pastilla">+${restantes}</span>` : ''}</div>
      <div class="caso__pie">
        ${pie}
        <a class="boton boton--linea boton--pequeno" href="caso.html?id=${encodeURIComponent(c.id)}">Ver caso</a>
      </div>
    </div>
  </article>`;
}

export function tarjetaProfesional(p) {
  const servicios = (p.servicios || []).slice(0, 4)
    .map(s => `<span class="pastilla">${esc(nombreDe(M_SERVICIOS, s))}</span>`).join('');
  const zonas = (p.zonas_atencion || []).join(', ');

  return `
  <article class="tarjeta">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px">
      <div>
        <h3 style="margin-bottom:2px">${esc(p.nombre)}</h3>
        <div style="font-size:.84rem;color:var(--navy);font-weight:600">${esc(nombreDe(M_PROFESIONES, p.profesion, p.otra_profesion))}</div>
      </div>
      ${p.tiene_matricula ? '<span class="etq etq--ok">Matrícula verificada</span>' : ''}
    </div>
    <div style="font-size:.83rem;color:var(--ink-3);margin-bottom:12px">
      ${esc(p.ciudad || '')}${p.departamento ? ', ' + esc(p.departamento) : ''}
      ${p.anos_experiencia ? ` · ${esc(p.anos_experiencia)} años de experiencia` : ''}
    </div>
    ${p.descripcion ? `<p style="font-size:.9rem;color:var(--ink-2)">${esc(p.descripcion)}</p>` : ''}
    <div class="pastillas">${servicios}</div>
    ${zonas ? `<div style="font-size:.8rem;color:var(--ink-3);margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
      <strong>Atiende en:</strong> ${esc(zonas)}${p.disponibilidad ? ` · ${esc(p.disponibilidad)}` : ''}</div>` : ''}
  </article>`;
}

export function tarjetaVoluntario(v) {
  const habilidades = (v.habilidades || []).slice(0, 5)
    .map(h => `<span class="pastilla">${esc(nombreDe(M_HABILIDADES, h))}</span>`).join('');
  const zonas = (v.zonas_atencion || []).join(', ');

  return `
  <article class="tarjeta">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px">
      <div>
        <h3 style="margin-bottom:2px">${esc(v.nombre)}</h3>
        ${v.oficio ? `<div style="font-size:.84rem;color:var(--gold-600);font-weight:600">${esc(v.oficio)}</div>` : ''}
      </div>
      ${v.tiene_vehiculo ? `<span class="etq etq--dorada">${icono('camion', 14, 1.9)} Con vehículo</span>` : ''}
    </div>
    <div style="font-size:.83rem;color:var(--ink-3);margin-bottom:12px">
      ${esc(v.ciudad || '')}${v.departamento ? ', ' + esc(v.departamento) : ''}
      ${v.disponibilidad ? ` · ${esc(v.disponibilidad)}` : ''}
    </div>
    ${v.descripcion ? `<p style="font-size:.9rem;color:var(--ink-2)">${esc(v.descripcion)}</p>` : ''}
    <div class="pastillas">${habilidades}</div>
    ${zonas ? `<div style="font-size:.8rem;color:var(--ink-3);margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
      <strong>Puede desplazarse a:</strong> ${esc(zonas)}${v.tipo_vehiculo ? ` · ${esc(v.tipo_vehiculo)}` : ''}</div>` : ''}
  </article>`;
}

export function estadoViviendaTexto(id) {
  return nombreDe(M_VIVIENDA, id, 'Sin especificar');
}
