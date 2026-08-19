/* SOS por Colombia · Formulario de publicación de casos */

import {
  montarBase, $, $$, esc, aviso, modal, casillas, opcionesSelect,
  leerFormulario, validar, ocupar
} from './ui.js';
import { registrarCaso, subirFoto } from './api.js';
import { DEPARTAMENTOS, NECESIDADES, ESTADOS_VIVIENDA, TENENCIAS } from './datos.js';
import { CONFIG, MODO_DEMO } from './config.js';

montarBase();

/* ---- Llenado de listas ---- */
$('#departamento').innerHTML     = opcionesSelect(DEPARTAMENTOS, '', 'Seleccione');
$('#estado_vivienda').innerHTML  = opcionesSelect(ESTADOS_VIVIENDA, '', 'Seleccione');
$('#tenencia').innerHTML         = opcionesSelect(TENENCIAS, '', 'Seleccione');
$('#opc-necesidades').innerHTML  = casillas('necesidades', NECESIDADES);

/* ---- Contador de caracteres ---- */
const historia = $('#historia');
historia.addEventListener('input', () => { $('#contador').textContent = historia.value.trim().length; });

/* ---- Manejo de fotos ---- */
const seleccionadas = [];
const zona   = $('#zona-fotos');
const input  = $('#entrada-fotos');
const previa = $('#previsualizacion');

zona.addEventListener('click', () => input.click());
zona.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
['dragenter', 'dragover'].forEach(ev =>
  zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.add('encima'); }));
['dragleave', 'drop'].forEach(ev =>
  zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.remove('encima'); }));
zona.addEventListener('drop', e => agregar(e.dataTransfer.files));
input.addEventListener('change', () => { agregar(input.files); input.value = ''; });

function agregar(archivos) {
  for (const a of Array.from(archivos)) {
    if (seleccionadas.length >= CONFIG.MAX_FOTOS) {
      aviso(`Máximo ${CONFIG.MAX_FOTOS} fotos.`, 'error'); break;
    }
    if (!a.type.startsWith('image/')) { aviso(`"${a.name}" no es una imagen.`, 'error'); continue; }
    if (a.size > CONFIG.MAX_MB_FOTO * 1024 * 1024) {
      aviso(`"${a.name}" pesa más de ${CONFIG.MAX_MB_FOTO} MB.`, 'error'); continue;
    }
    seleccionadas.push(a);
  }
  pintarPrevia();
}

function pintarPrevia() {
  previa.innerHTML = seleccionadas.map((a, i) => `
    <figure>
      <img src="${URL.createObjectURL(a)}" alt="${esc(a.name)}">
      <button type="button" data-quitar="${i}" aria-label="Quitar ${esc(a.name)}">×</button>
    </figure>`).join('');
  $$('[data-quitar]', previa).forEach(b =>
    b.addEventListener('click', () => { seleccionadas.splice(Number(b.dataset.quitar), 1); pintarPrevia(); }));
}

/* ---- Envío ---- */
const form = $('#form-caso');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar(form, { necesidades: 'Marque al menos una necesidad' })) return;

  if (historia.value.trim().length < 60) {
    aviso('Cuéntenos un poco más: la historia debe tener al menos 60 caracteres.', 'error');
    historia.focus();
    return;
  }

  const boton = form.querySelector('button[type=submit]');
  const restaurar = ocupar(boton, 'Enviando…');
  const d = leerFormulario(form);

  try {
    // 1) Subir fotografías
    const fotos = [];
    for (let i = 0; i < seleccionadas.length; i++) {
      boton.innerHTML = `Subiendo foto ${i + 1} de ${seleccionadas.length}…`;
      const url = await subirFoto(seleccionadas[i]);
      fotos.push({ url, descripcion: '' });
    }

    boton.innerHTML = 'Guardando el caso…';

    // 2) Guardar el caso
    const guardado = await registrarCaso({
      nombre_contacto: d.nombre_contacto,
      parentesco: d.parentesco || null,
      telefono: d.telefono,
      email: d.email || null,
      direccion: d.direccion || null,
      departamento: d.departamento,
      municipio: d.municipio,
      barrio: d.barrio || null,
      personas_hogar: Number(d.personas_hogar || 0),
      ninos: Number(d.ninos || 0),
      adultos_mayores: Number(d.adultos_mayores || 0),
      personas_discapacidad: Number(d.personas_discapacidad || 0),
      estado_vivienda: d.estado_vivienda,
      tenencia: d.tenencia || null,
      titulo: d.titulo,
      historia: d.historia,
      urgencia: d.urgencia,
      necesidades: Array.isArray(d.necesidades) ? d.necesidades : [d.necesidades].filter(Boolean),
      fotos,
      autoriza_datos: true,
      autoriza_fotos: !!d.autoriza_fotos
    });

    form.reset();
    seleccionadas.length = 0;
    pintarPrevia();
    $('#contador').textContent = '0';
    restaurar();

    modal(`
      <div style="text-align:center;padding:10px 0">
        <div style="font-size:2.8rem">💛</div>
        <h2 style="font-size:1.4rem">Su caso quedó registrado</h2>
        ${guardado && guardado.codigo ? `<p style="font-size:1.05rem"><strong>Código: ${esc(guardado.codigo)}</strong><br>
          <span style="font-size:.86rem;color:var(--ink-2)">Guárdelo. Con él puede consultar y hacer seguimiento.</span></p>` : ''}
        <p style="color:var(--ink-2)">
          Un moderador de la Fundación lo revisará antes de publicarlo, normalmente en menos de 48 horas.
          Lo contactaremos al teléfono que nos dejó.
        </p>
        ${MODO_DEMO ? `<div class="aviso aviso--alerta" style="text-align:left"><span class="aviso__icono">⚠️</span>
          <div>Este sitio está en modo demostración: el caso <strong>no se guardó</strong> en ninguna base de datos.</div></div>` : ''}
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
          <a class="boton boton--primario" href="casos.html">Ver otras familias</a>
          <a class="boton boton--linea" href="ayuda.html">¿Dónde consigo ayuda ya?</a>
        </div>
      </div>`);

  } catch (err) {
    restaurar();
    aviso('No fue posible enviar el caso: ' + err.message, 'error');
  }
});
