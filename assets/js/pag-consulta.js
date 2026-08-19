/* SOS por Colombia · Consulta del caso por parte de la familia */

import { montarBase, $, esc, fecha, aviso, leerFormulario, validar, ocupar, parametro } from './ui.js';
import { consultarCaso } from './api.js';
import { M_NECESIDADES, M_PROFESIONES, nombreDe } from './datos.js';
import { icono } from './iconos.js';
import { mostrar as mostrarTelefono, enlace as enlaceWhatsApp } from './whatsapp.js';

montarBase();

const form = $('#form-consulta');
const salida = $('#resultado');

/* Permite llegar con el código en la dirección: consulta.html?codigo=SOS-1001 */
if (parametro('codigo')) $('#codigo').value = parametro('codigo');

const ETAPAS = {
  pendiente: {
    etq: 'En revisión', clase: 'etq--media', icono: 'escudo',
    texto: 'Su caso llegó bien y está siendo verificado por el equipo. Normalmente esto toma menos de 48 horas.'
  },
  aprobado: {
    etq: 'Publicado', clase: 'etq--baja', icono: 'casa-danada',
    texto: 'Su caso ya está publicado y visible para los profesionales y voluntarios inscritos.'
  },
  resuelto: {
    etq: 'Resuelto', clase: 'etq--ok', icono: 'casa-corazon',
    texto: 'Su caso quedó marcado como resuelto. Gracias por contarnos cómo terminó.'
  },
  rechazado: {
    etq: 'No publicado', clase: 'etq--neutra', icono: 'documento',
    texto: 'Este caso no pudo publicarse. Escríbanos y lo revisamos con usted.'
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar(form)) return;

  const boton = form.querySelector('button[type=submit]');
  const restaurar = ocupar(boton, 'Buscando…');
  const d = leerFormulario(form);
  salida.innerHTML = '';

  try {
    const caso = await consultarCaso(d.codigo, d.telefono);
    restaurar();

    if (!caso) {
      salida.innerHTML = `
        <div class="aviso aviso--alerta">
          <span class="aviso__icono">🔎</span>
          <div>
            <strong>No encontramos ese caso.</strong> Revise que el código esté completo
            (empieza por SOS-) y que los cuatro números sean los del WhatsApp con el que
            reportó el caso. Si acaba de enviarlo, espere a que el equipo lo verifique.
          </div>
        </div>`;
      return;
    }

    pintar(caso);
  } catch (err) {
    restaurar();
    aviso('No fue posible consultar: ' + err.message, 'error');
  }
});

function pintar(c) {
  const etapa = ETAPAS[c.estado] || ETAPAS.pendiente;
  const padrinos = c.padrinos || [];

  const necesidades = (c.necesidades || []).map(n => {
    const o = M_NECESIDADES[n];
    return `<span class="pastilla">${o ? icono(o.svg, 15, 1.8) + esc(o.nombre) : esc(n)}</span>`;
  }).join('');

  const bloquePadrinos = padrinos.length ? `
    <div class="tarjeta" style="margin-top:18px;border-color:#B6E0D0;background:var(--green-50)">
      <h3 style="color:#0B5C43">Quién la está acompañando</h3>
      ${padrinos.map(p => {
        const tel = mostrarTelefono(p.telefono);
        const wa = enlaceWhatsApp(p.telefono,
          `Hola ${p.nombre}, le escribo del caso ${c.codigo} de SOS por Colombia.`);
        return `
        <div style="padding:14px 0;border-top:1px solid rgba(14,124,90,.18)">
          <strong style="font-size:1.05rem">${esc(p.nombre)}</strong>
          ${p.profesion ? `<div style="font-size:.88rem;color:var(--ink-2)">${esc(nombreDe(M_PROFESIONES, p.profesion, p.profesion))}</div>` : ''}
          <p style="margin:8px 0;font-size:.92rem;color:var(--ink-2)">
            Se comprometió a: ${esc(p.compromiso)}${p.plazo ? ` · Plazo: ${esc(p.plazo)}` : ''}
          </p>
          ${tel ? `<div style="font-size:.95rem;margin-bottom:10px">WhatsApp: <strong>${esc(tel)}</strong></div>` : ''}
          ${wa ? `<a class="boton boton--whatsapp boton--pequeno" href="${esc(wa)}" target="_blank" rel="noopener">Escribirle por WhatsApp</a>` : ''}
        </div>`;
      }).join('')}
    </div>` : (c.estado === 'aprobado' ? `
    <div class="aviso aviso--info" style="margin-top:18px">
      <span class="aviso__icono">⏳</span>
      <div>Todavía nadie ha tomado su caso. Le avisamos por WhatsApp apenas alguien se comprometa.
      Mientras tanto, revise el <a href="ayuda.html">directorio de ayuda</a>: ahí están las líneas
      oficiales y los puntos de acopio.</div>
    </div>` : '');

  salida.innerHTML = `
  <div class="tarjeta">
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
      <span class="etq etq--neutra">${esc(c.codigo)}</span>
      <span class="etq ${etapa.clase}">${esc(etapa.etq)}</span>
      <span style="color:var(--ink-3);font-size:.85rem;margin-left:auto">
        Reportado el ${esc(fecha(c.creado_en))}
      </span>
    </div>

    <div style="display:flex;gap:16px;align-items:flex-start">
      <div class="icono-caja" style="margin:0;flex-shrink:0">${icono(etapa.icono, 24)}</div>
      <div>
        <h2 style="font-size:1.2rem;margin-bottom:.3em">${esc(c.titulo)}</h2>
        <p style="color:var(--ink-2);margin-bottom:10px">${esc(etapa.texto)}</p>
        <div style="font-size:.86rem;color:var(--ink-3)">
          ${esc(c.municipio || '')}${c.departamento ? ', ' + esc(c.departamento) : ''}
        </div>
      </div>
    </div>

    ${necesidades ? `<div style="margin-top:16px">
      <div style="font-size:.85rem;font-weight:600;margin-bottom:8px">Lo que pidió:</div>
      <div class="pastillas">${necesidades}</div>
    </div>` : ''}

    ${c.nota_moderacion ? `<div class="aviso aviso--info" style="margin-top:16px">
      <span class="aviso__icono">💬</span><div>${esc(c.nota_moderacion)}</div></div>` : ''}
  </div>

  ${bloquePadrinos}`;

  salida.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
