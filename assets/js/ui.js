/* =====================================================================
   SOS POR COLOMBIA · Componentes e utilidades de interfaz
   ===================================================================== */

import { CONFIG, MODO_DEMO } from './config.js';
import { icono } from './iconos.js';
import { esWhatsApp } from './whatsapp.js';

/* ---------- Ayudas básicas ---------- */
export const $  = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

/** Escapa texto para insertarlo con seguridad en HTML. */
export function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function fecha(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

export function haceCuanto(iso) {
  if (!iso) return '';
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  if (dias < 30) return `hace ${dias} días`;
  return fecha(iso);
}

export const parametro = (n) => new URLSearchParams(location.search).get(n);

/* ---------- Menús de selección ---------- */
export function opcionesSelect(lista, seleccionado = '', textoVacio = 'Todos') {
  const items = lista.map(o => {
    const id = typeof o === 'string' ? o : o.id;
    const nom = typeof o === 'string' ? o : o.nombre;
    return `<option value="${esc(id)}"${id === seleccionado ? ' selected' : ''}>${esc(nom)}</option>`;
  }).join('');
  return `<option value="">${esc(textoVacio)}</option>${items}`;
}

export function casillas(nombre, lista, seleccionados = []) {
  return lista.map(o => `
    <label class="opcion">
      <input type="checkbox" name="${esc(nombre)}" value="${esc(o.id)}"${seleccionados.includes(o.id) ? ' checked' : ''}>
      <span>${o.svg ? icono(o.svg, 18, 1.8) : ''}${esc(o.nombre)}</span>
    </label>`).join('');
}

/* ---------- Mensajes flotantes ---------- */
export function aviso(texto, tipo = '') {
  let caja = $('.mensajes');
  if (!caja) {
    caja = document.createElement('div');
    caja.className = 'mensajes';
    caja.setAttribute('role', 'status');
    caja.setAttribute('aria-live', 'polite');
    document.body.appendChild(caja);
  }
  const m = document.createElement('div');
  m.className = 'mensaje' + (tipo ? ` mensaje--${tipo}` : '');
  m.textContent = texto;
  caja.appendChild(m);
  setTimeout(() => m.remove(), 5200);
}

/* ---------- Estados de carga ---------- */
export const cargando = (texto = 'Cargando…') =>
  `<div class="cargando"><div class="girador"></div>${esc(texto)}</div>`;

export const vacio = (titulo, detalle = '', icono = '🔎') =>
  `<div class="vacio"><div class="vacio__icono">${icono}</div>
     <h3>${esc(titulo)}</h3>${detalle ? `<p>${esc(detalle)}</p>` : ''}</div>`;

/* ---------- Encabezado y pie compartidos ---------- */
const PAGINAS = [
  { href: 'index.html',         texto: 'Inicio' },
  { href: 'casos.html',         texto: 'Familias' },
  { href: 'profesionales.html', texto: 'Profesionales' },
  { href: 'voluntarios.html',   texto: 'Voluntarios' },
  { href: 'ayuda.html',         texto: 'Dónde hay ayuda' },
  { href: 'tablero.html',       texto: 'Tablero' }
];

export function montarEncabezado() {
  const actual = location.pathname.split('/').pop() || 'index.html';
  const enlaces = PAGINAS.map(p =>
    `<a href="${p.href}"${p.href === actual ? ' aria-current="page"' : ''}>${esc(p.texto)}</a>`).join('');

  const html = `
  <div class="franja-alerta">
    Emergencia en curso · Si hay personas atrapadas o heridas llame al
    <a href="tel:123">123</a> · Cruz Roja <a href="tel:132">132</a> · Defensa Civil <a href="tel:144">144</a>
  </div>
  ${MODO_DEMO ? `<div class="aviso-modo">Modo demostración: el sitio funciona con datos de ejemplo y todavía no guarda información. Conecte Supabase en <code>assets/js/config.js</code>.</div>` : ''}
  <header class="encabezado">
    <div class="contenedor encabezado__fila">
      <a class="marca" href="index.html">
        <span class="marca__sello">SOS</span>
        <span class="marca__texto">
          <strong>SOS por Colombia</strong>
          <span>${esc(CONFIG.ORGANIZACION)}</span>
        </span>
      </a>
      <button class="menu-boton" type="button" aria-expanded="false" aria-controls="nav-principal" aria-label="Abrir menú">☰</button>
      <nav class="nav" id="nav-principal">
        ${enlaces}
        <a class="nav__cta" href="publicar.html">Necesito ayuda</a>
      </nav>
    </div>
  </header>`;

  // Se insertan como hijos directos de <body> para que el encabezado
  // pegajoso siga visible en toda la página (un <div> contenedor lo cortaría).
  const plantilla = document.createElement('template');
  plantilla.innerHTML = html.trim();
  document.body.prepend(plantilla.content);

  const boton = $('.menu-boton');
  const nav = $('#nav-principal');
  boton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });
}

export function montarPie() {
  const wa = CONFIG.WHATSAPP
    ? `<li><a href="https://wa.me/${esc(CONFIG.WHATSAPP)}" target="_blank" rel="noopener">WhatsApp</a></li>` : '';
  const html = `
  <footer class="pie">
    <div class="contenedor">
      <div class="pie__rejilla">
        <div>
          <h4>SOS por Colombia</h4>
          <p>Plataforma ciudadana que conecta a las familias afectadas por el ${esc(CONFIG.EVENTO)} con profesionales y voluntarios dispuestos a acompañarlas hasta que su vida vuelva a la normalidad.</p>
        </div>
        <div>
          <h4>Participar</h4>
          <ul class="pie__lista">
            <li><a href="publicar.html">Reportar mi caso</a></li>
            <li><a href="consulta.html">Consultar mi caso</a></li>
            <li><a href="profesionales.html#inscribirme">Inscribirme como profesional</a></li>
            <li><a href="voluntarios.html#inscribirme">Inscribirme como voluntario</a></li>
            <li><a href="casos.html">Apadrinar una familia</a></li>
            <li><a href="tablero.html">Tablero de resultados</a></li>
          </ul>
        </div>
        <div>
          <h4>Emergencias</h4>
          <ul class="pie__lista">
            <li><a href="tel:123">123 · Emergencias</a></li>
            <li><a href="tel:132">132 · Cruz Roja</a></li>
            <li><a href="tel:144">144 · Defensa Civil</a></li>
            <li><a href="tel:119">119 · Bomberos</a></li>
            <li><a href="ayuda.html">Todos los canales</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul class="pie__lista">
            <li><a href="mailto:${esc(CONFIG.CORREO_CONTACTO)}">${esc(CONFIG.CORREO_CONTACTO)}</a></li>
            ${wa}
            <li><a href="privacidad.html">Tratamiento de datos personales</a></li>
            <li><a href="admin.html">Panel de moderación</a></li>
          </ul>
        </div>
      </div>
      <div class="pie__base">
        <span>Una iniciativa de ${esc(CONFIG.ORGANIZACION)}</span>
        <span>Los datos personales se tratan conforme a la Ley 1581 de 2012.</span>
      </div>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

export function montarBase() {
  montarEncabezado();
  montarPie();
}

/* ---------- Formularios ---------- */

/** Devuelve un objeto con los valores del formulario. */
export function leerFormulario(form) {
  const datos = {};
  const fd = new FormData(form);
  for (const [k, v] of fd.entries()) {
    if (datos[k] === undefined) datos[k] = v;
    else if (Array.isArray(datos[k])) datos[k].push(v);
    else datos[k] = [datos[k], v];
  }
  // Los grupos de casillas siempre deben quedar como arreglo
  $$('input[type=checkbox]', form).forEach(c => {
    const n = c.name;
    if (!n) return;
    const grupo = $$(`input[type=checkbox][name="${CSS.escape(n)}"]`, form);
    if (grupo.length > 1) {
      datos[n] = grupo.filter(x => x.checked).map(x => x.value);
    }
  });
  return datos;
}

export function marcarError(campo, mensaje) {
  campo.setAttribute('aria-invalid', 'true');
  let p = campo.parentElement.querySelector('.error-campo');
  if (!p) {
    p = document.createElement('span');
    p.className = 'error-campo';
    campo.parentElement.appendChild(p);
  }
  p.textContent = mensaje;
}

export function limpiarErrores(form) {
  $$('[aria-invalid]', form).forEach(c => c.removeAttribute('aria-invalid'));
  $$('.error-campo', form).forEach(e => e.remove());
}

/**
 * Valida los campos requeridos y los grupos de casillas obligatorios.
 * @param {HTMLFormElement} form
 * @param {Object} reglas  { nombreCampo: 'mensaje' } para grupos de casillas
 */
export function validar(form, reglas = {}) {
  limpiarErrores(form);
  let ok = true, primero = null;

  $$('[required]', form).forEach(campo => {
    const vacio = campo.type === 'checkbox' ? !campo.checked : !String(campo.value || '').trim();
    if (vacio) {
      marcarError(campo, campo.type === 'checkbox' ? 'Debe aceptar para continuar' : 'Este campo es obligatorio');
      ok = false; primero = primero || campo;
    } else if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campo.value.trim())) {
      marcarError(campo, 'Escriba un correo válido');
      ok = false; primero = primero || campo;
    } else if (campo.dataset.whatsapp !== undefined && !esWhatsApp(campo.value)) {
      marcarError(campo, 'Escriba un celular con WhatsApp: 10 dígitos que empiezan por 3');
      ok = false; primero = primero || campo;
    }
  });

  for (const [nombre, mensaje] of Object.entries(reglas)) {
    const grupo = $$(`input[type=checkbox][name="${CSS.escape(nombre)}"]`, form);
    if (grupo.length && !grupo.some(c => c.checked)) {
      const cont = grupo[0].closest('.campo') || grupo[0].parentElement;
      let p = cont.querySelector('.error-campo');
      if (!p) { p = document.createElement('span'); p.className = 'error-campo'; cont.appendChild(p); }
      p.textContent = mensaje;
      ok = false; primero = primero || grupo[0];
    }
  }

  if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return ok;
}

/** Deja el botón en estado "enviando…" y devuelve la función para restaurarlo. */
export function ocupar(boton, texto = 'Enviando…') {
  const original = boton.innerHTML;
  boton.disabled = true;
  boton.innerHTML = texto;
  return () => { boton.disabled = false; boton.innerHTML = original; };
}

/* ---------- Modal ---------- */
export function modal(html, alCerrar) {
  const cont = document.createElement('div');
  cont.className = 'modal';
  cont.innerHTML = `<div class="modal__caja" role="dialog" aria-modal="true">
      <button class="modal__cerrar" type="button" aria-label="Cerrar">×</button>
      <div class="modal__contenido">${html}</div>
    </div>`;
  document.body.appendChild(cont);
  document.body.style.overflow = 'hidden';

  const cerrar = () => {
    cont.remove();
    document.body.style.overflow = '';
    if (alCerrar) alCerrar();
  };
  cont.querySelector('.modal__cerrar').addEventListener('click', cerrar);
  cont.addEventListener('click', e => { if (e.target === cont) cerrar(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); }
  });
  return { elemento: cont, cerrar };
}
