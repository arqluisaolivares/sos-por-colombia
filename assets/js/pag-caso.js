/* SOS por Colombia · Detalle de un caso y formulario de apadrinamiento */

import {
  montarBase, $, $$, esc, fecha, vacio, aviso, modal, casillas,
  leerFormulario, validar, ocupar, parametro
} from './ui.js';
import { traerCaso, verificarRegistro, proponerApadrinamiento } from './api.js';
import { M_NECESIDADES, M_PROFESIONES, NECESIDADES, nombreDe } from './datos.js';
import { estadoViviendaTexto } from './componentes.js';
import { icono } from './iconos.js';
import { MODO_DEMO } from './config.js';

montarBase();

const id = parametro('id');
const cont = $('#contenido');

if (!id) {
  cont.innerHTML = vacio('No se indicó ningún caso', 'Vuelva al listado y escoja una familia.', '🔎');
} else {
  traerCaso(id).then(c => {
    if (!c) {
      cont.innerHTML = vacio('Este caso no está disponible',
        'Puede que haya sido retirado o que todavía esté en verificación.', '🔎');
      return;
    }
    pintar(c);
  }).catch(e => {
    cont.innerHTML = vacio('No fue posible cargar el caso', e.message, '⚠️');
  });
}

function pintar(c) {
  document.title = `${c.codigo} · ${c.titulo} · SOS por Colombia`;
  $('#miga-codigo').textContent = c.codigo || 'Caso';

  const fotos = (c.fotos || []).map(f => typeof f === 'string' ? { url: f } : f);
  const padrinos = c.padrinos || [];
  const resuelto = c.estado === 'resuelto';

  const necesidades = (c.necesidades || []).map(n => {
    const o = M_NECESIDADES[n];
    return `<span class="pastilla">${o ? icono(o.svg, 16, 1.8) + esc(o.nombre) : esc(n)}</span>`;
  }).join('');

  const galeria = fotos.length
    ? `<div class="galeria">${fotos.map(f =>
        `<a href="${esc(f.url)}" target="_blank" rel="noopener"><img src="${esc(f.url)}" alt="${esc(f.descripcion || 'Fotografía del caso ' + c.codigo)}" loading="lazy"></a>`).join('')}</div>`
    : '';

  const listaPadrinos = padrinos.length ? `
    <div class="tarjeta" style="margin-top:22px;border-color:#B6E0D0;background:var(--green-50)">
      <h3 style="color:#0B5C43">Quién acompaña este caso</h3>
      ${padrinos.map(p => `
        <div style="padding:12px 0;border-top:1px solid rgba(14,124,90,.18)">
          <strong>${esc(p.nombre)}</strong>
          ${p.profesion ? ` · <span style="color:var(--ink-2)">${esc(nombreDe(M_PROFESIONES, p.profesion, p.profesion))}</span>` : ''}
          ${p.estado === 'completado' ? ' <span class="etq etq--ok">Cumplido</span>' : ''}
          <p style="margin:6px 0 0;font-size:.9rem;color:var(--ink-2)">${esc(p.compromiso)}</p>
        </div>`).join('')}
    </div>` : '';

  cont.innerHTML = `
  <div class="detalle">
    <div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <span class="etq etq--neutra">${esc(c.codigo || '')}</span>
        ${resuelto ? '<span class="etq etq--ok">Caso resuelto</span>'
                   : `<span class="etq etq--${esc(c.urgencia)}">Urgencia ${esc(c.urgencia)}</span>`}
        ${padrinos.length ? '<span class="etq etq--ok">Apadrinado</span>' : '<span class="etq etq--dorada">Busca padrino</span>'}
      </div>

      <h1 style="font-size:clamp(1.5rem,3.2vw,2.15rem)">${esc(c.titulo)}</h1>
      <p style="color:var(--ink-3);font-size:.92rem">
        ${esc(c.municipio || '')}${c.barrio ? ' · ' + esc(c.barrio) : ''}, ${esc(c.departamento || '')}
        · Publicado el ${esc(fecha(c.creado_en))}
      </p>

      ${galeria}

      <h2 style="font-size:1.2rem;margin-top:26px">La historia de la familia</h2>
      <p style="white-space:pre-line;color:var(--ink-2)">${esc(c.historia || '')}</p>

      <h2 style="font-size:1.2rem;margin-top:26px">Qué necesita</h2>
      <div class="pastillas">${necesidades || '<span class="pastilla">Sin especificar</span>'}</div>

      ${listaPadrinos}
    </div>

    <aside class="lateral">
      <div class="tarjeta">
        <h3>Ficha del caso</h3>
        <dl style="margin:0">
          <div class="dato"><dt>Personas en el hogar</dt><dd>${esc(c.personas_hogar ?? '—')}</dd></div>
          <div class="dato"><dt>Niñas y niños</dt><dd>${esc(c.ninos ?? 0)}</dd></div>
          <div class="dato"><dt>Adultos mayores</dt><dd>${esc(c.adultos_mayores ?? 0)}</dd></div>
          <div class="dato"><dt>Personas con discapacidad</dt><dd>${esc(c.personas_discapacidad ?? 0)}</dd></div>
          <div class="dato"><dt>Estado de la vivienda</dt><dd>${esc(estadoViviendaTexto(c.estado_vivienda))}</dd></div>
          <div class="dato"><dt>Contacto</dt><dd>${esc(c.nombre_publico || 'Reservado')}</dd></div>
        </dl>
        <p style="font-size:.78rem;color:var(--ink-3);margin:14px 0 0">
          El teléfono y la dirección de la familia son reservados. Se comparten únicamente con quien
          apadrina el caso, después de la verificación del moderador.
        </p>
      </div>

      ${resuelto ? `
        <div class="aviso aviso--ok" style="margin-top:16px">
          <span class="aviso__icono">✓</span>
          <div>Este caso ya fue resuelto. Gracias a quienes lo acompañaron.</div>
        </div>`
      : `
        <div class="tarjeta" style="margin-top:16px;background:var(--navy);color:#fff;border:none">
          <h3 style="color:#fff">Apadrinar este caso</h3>
          <p style="font-size:.89rem;color:rgba(255,255,255,.85)">
            Apadrinar significa comprometerse con algo concreto y cumplirlo: una visita técnica, unos planos,
            un mercado mensual, un acompañamiento jurídico.
          </p>
          <button class="boton boton--dorado boton--ancho" id="btn-apadrinar">Quiero apadrinar</button>
          <p style="font-size:.76rem;color:rgba(255,255,255,.6);margin:12px 0 0">
            Debe estar inscrito como profesional o voluntario. ¿Aún no lo está?
            <a href="profesionales.html#inscribirme" style="color:var(--gold)">Inscríbase aquí</a>.
          </p>
        </div>

        <div class="tarjeta" style="margin-top:16px">
          <h3 style="font-size:1rem">Compartir el caso</h3>
          <button class="boton boton--linea boton--ancho boton--pequeno" id="btn-copiar">Copiar enlace</button>
        </div>`}
    </aside>
  </div>`;

  const btnCopiar = $('#btn-copiar');
  if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); aviso('Enlace copiado', 'ok'); }
      catch { aviso('No fue posible copiar el enlace', 'error'); }
    });
  }

  const btn = $('#btn-apadrinar');
  if (btn) btn.addEventListener('click', () => abrirApadrinar(c));
}

/* ------------------------------------------------------------------ */
function abrirApadrinar(c) {
  const { cerrar } = modal(`
    <h2 style="font-size:1.3rem">Apadrinar ${esc(c.codigo)}</h2>
    <p style="font-size:.9rem;color:var(--ink-2)">${esc(c.titulo)}</p>

    <div class="aviso aviso--info" style="margin-bottom:18px">
      <span class="aviso__icono">ℹ️</span>
      <div>Solo pedimos aquello que realmente pueda cumplir. Un compromiso pequeño y cumplido
      vale más que uno grande que se queda a medias.</div>
    </div>

    <form id="form-apadrinar" class="formulario" novalidate>
      <div class="campo">
        <label for="ap-email">Correo con el que se inscribió <span style="color:var(--red)">*</span></label>
        <input type="email" id="ap-email" name="email" required autocomplete="email" placeholder="nombre@correo.com">
        <span class="ayuda">Lo usamos para confirmar que ya está inscrito en la plataforma.</span>
      </div>
      <div class="campos-fila">
        <div class="campo">
          <label for="ap-nombre">Nombre completo <span style="color:var(--red)">*</span></label>
          <input type="text" id="ap-nombre" name="nombre" required autocomplete="name">
        </div>
        <div class="campo">
          <label for="ap-telefono">Número de WhatsApp <span style="color:var(--red)">*</span></label>
          <input type="tel" id="ap-telefono" name="telefono" required autocomplete="tel"
                 inputmode="numeric" data-whatsapp placeholder="300 000 0000">
          <span class="ayuda">Es el número que le pasamos a la familia.</span>
        </div>
      </div>
      <div class="campo">
        <label for="ap-perfil">Participo como <span style="color:var(--red)">*</span></label>
        <select id="ap-perfil" name="perfil" required>
          <option value="profesional">Profesional</option>
          <option value="voluntario">Voluntario</option>
          <option value="organizacion">Organización o empresa</option>
          <option value="persona">Persona natural</option>
        </select>
      </div>
      <div class="campo">
        <label>¿Con qué va a ayudar? <span style="color:var(--red)">*</span></label>
        <div class="opciones">${casillas('tipo_ayuda', NECESIDADES)}</div>
      </div>
      <div class="campo">
        <label for="ap-compromiso">¿A qué se compromete exactamente? <span style="color:var(--red)">*</span></label>
        <textarea id="ap-compromiso" name="compromiso" required
          placeholder="Ejemplo: hago la visita de evaluación estructural y entrego un concepto técnico escrito, sin costo para la familia."></textarea>
      </div>
      <div class="campo">
        <label for="ap-plazo">¿En qué plazo?</label>
        <input type="text" id="ap-plazo" name="plazo" placeholder="Ejemplo: dentro de las próximas dos semanas">
      </div>

      <button class="boton boton--primario boton--ancho" type="submit">Enviar mi compromiso</button>
      <p style="font-size:.78rem;color:var(--ink-3);margin:0">
        Un moderador confirmará su inscripción y le enviará los datos de contacto de la familia.
      </p>
    </form>
  `);

  const form = $('#form-apadrinar');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validar(form, { tipo_ayuda: 'Escoja al menos una forma de ayuda' })) return;

    const boton = form.querySelector('button[type=submit]');
    const restaurar = ocupar(boton, 'Verificando…');
    const d = leerFormulario(form);

    try {
      if (!MODO_DEMO) {
        const reg = await verificarRegistro(d.email);
        if (!reg || !reg.registrado) {
          restaurar();
          aviso('Ese correo no figura entre los inscritos aprobados. Inscríbase primero.', 'error');
          return;
        }
      }
      await proponerApadrinamiento({
        caso_id: c.id,
        nombre: d.nombre, email: d.email, telefono: d.telefono || null,
        perfil: d.perfil, profesion: null,
        tipo_ayuda: Array.isArray(d.tipo_ayuda) ? d.tipo_ayuda : [d.tipo_ayuda].filter(Boolean),
        compromiso: d.compromiso, plazo: d.plazo || null
      });
      cerrar();
      modal(`
        <div style="text-align:center;padding:12px 0">
          <div style="font-size:2.6rem">🤝</div>
          <h2 style="font-size:1.35rem">Gracias. Su compromiso quedó registrado.</h2>
          <p style="color:var(--ink-2)">
            Un moderador de la Fundación verificará su inscripción y le escribirá al correo
            <strong>${esc(d.email)}</strong> con los datos de contacto de la familia del caso
            <strong>${esc(c.codigo)}</strong>.
          </p>
          <a class="boton boton--primario" href="casos.html">Ver otras familias</a>
        </div>`);
    } catch (err) {
      restaurar();
      aviso('No fue posible registrar el compromiso: ' + err.message, 'error');
    }
  });
}
