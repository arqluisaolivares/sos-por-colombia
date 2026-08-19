/* =====================================================================
   SOS POR COLOMBIA · Capa de datos
   ---------------------------------------------------------------------
   Habla con Supabase mediante su API REST (PostgREST + Storage + Auth).
   No requiere ninguna librería externa.

   Si config.js no tiene credenciales, todo funciona contra los datos
   de ejemplo de demo.js sin escribir nada.
   ===================================================================== */

import { CONFIG, MODO_DEMO } from './config.js';
import {
  CASOS_DEMO, PROFESIONALES_DEMO, VOLUNTARIOS_DEMO, PUNTOS_DEMO,
  ESTADISTICAS_DEMO, PENDIENTES_DEMO
} from './demo.js';

const REST    = () => `${CONFIG.SUPABASE_URL}/rest/v1`;
const STORAGE = () => `${CONFIG.SUPABASE_URL}/storage/v1`;
const AUTH    = () => `${CONFIG.SUPABASE_URL}/auth/v1`;
const LLAVE_SESION = 'sos_sesion';

/* ------------------------------------------------------------------ */
/* Sesión de moderador                                                 */
/* ------------------------------------------------------------------ */
export const sesion = {
  leer() {
    try { return JSON.parse(localStorage.getItem(LLAVE_SESION) || 'null'); }
    catch { return null; }
  },
  guardar(s) { localStorage.setItem(LLAVE_SESION, JSON.stringify(s)); },
  borrar()   { localStorage.removeItem(LLAVE_SESION); },
  vigente() {
    const s = this.leer();
    return s && s.access_token && (!s.expira_en || s.expira_en > Date.now());
  }
};

function encabezados(extra = {}) {
  const s = sesion.leer();
  const token = (s && s.access_token) ? s.access_token : CONFIG.SUPABASE_ANON_KEY;
  return {
    apikey: CONFIG.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function pedir(url, opciones = {}) {
  const r = await fetch(url, opciones);
  if (!r.ok) {
    let detalle = '';
    try { const j = await r.json(); detalle = j.message || j.error_description || j.msg || j.error || ''; }
    catch { detalle = await r.text().catch(() => ''); }
    throw new Error(detalle || `Error ${r.status}`);
  }
  if (r.status === 204) return null;
  const texto = await r.text();
  return texto ? JSON.parse(texto) : null;
}

const esperar = (ms) => new Promise(r => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Lecturas públicas                                                   */
/* ------------------------------------------------------------------ */

export async function traerCasos({ departamento, necesidad, urgencia, estado, busqueda } = {}) {
  let lista;
  if (MODO_DEMO) {
    await esperar(180);
    lista = CASOS_DEMO.slice();
  } else {
    lista = await pedir(`${REST()}/v_casos?select=*&order=creado_en.desc`, { headers: encabezados() });
  }
  return filtrarCasos(lista, { departamento, necesidad, urgencia, estado, busqueda });
}

export function filtrarCasos(lista, { departamento, necesidad, urgencia, estado, busqueda } = {}) {
  const t = (busqueda || '').trim().toLowerCase();
  return lista.filter(c => {
    if (departamento && c.departamento !== departamento) return false;
    if (urgencia && c.urgencia !== urgencia) return false;
    if (estado && c.estado !== estado) return false;
    if (necesidad && !(c.necesidades || []).includes(necesidad)) return false;
    if (t) {
      const heno = [c.titulo, c.historia, c.municipio, c.barrio, c.codigo]
        .filter(Boolean).join(' ').toLowerCase();
      if (!heno.includes(t)) return false;
    }
    return true;
  });
}

export async function traerCaso(id) {
  if (MODO_DEMO) {
    await esperar(140);
    return CASOS_DEMO.find(c => c.id === id || c.codigo === id) || null;
  }
  const campo = String(id).startsWith('SOS-') ? 'codigo' : 'id';
  const r = await pedir(`${REST()}/v_casos?select=*&${campo}=eq.${encodeURIComponent(id)}&limit=1`,
    { headers: encabezados() });
  return (r && r[0]) || null;
}

export async function traerProfesionales({ profesion, departamento, servicio, busqueda } = {}) {
  let lista;
  if (MODO_DEMO) { await esperar(180); lista = PROFESIONALES_DEMO.slice(); }
  else lista = await pedir(`${REST()}/v_profesionales?select=*&order=creado_en.desc`, { headers: encabezados() });

  const t = (busqueda || '').trim().toLowerCase();
  return lista.filter(p => {
    if (profesion && p.profesion !== profesion) return false;
    if (servicio && !(p.servicios || []).includes(servicio)) return false;
    if (departamento && p.departamento !== departamento &&
        !(p.zonas_atencion || []).includes(departamento)) return false;
    if (t && !`${p.nombre} ${p.descripcion || ''} ${p.ciudad || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });
}

export async function traerVoluntarios({ habilidad, departamento, busqueda } = {}) {
  let lista;
  if (MODO_DEMO) { await esperar(180); lista = VOLUNTARIOS_DEMO.slice(); }
  else lista = await pedir(`${REST()}/v_voluntarios?select=*&order=creado_en.desc`, { headers: encabezados() });

  const t = (busqueda || '').trim().toLowerCase();
  return lista.filter(v => {
    if (habilidad && !(v.habilidades || []).includes(habilidad)) return false;
    if (departamento && v.departamento !== departamento &&
        !(v.zonas_atencion || []).includes(departamento)) return false;
    if (t && !`${v.nombre} ${v.oficio || ''} ${v.descripcion || ''} ${v.ciudad || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });
}

export async function traerPuntosAyuda({ tipo, departamento, busqueda } = {}) {
  let lista;
  if (MODO_DEMO) { await esperar(150); lista = PUNTOS_DEMO.slice(); }
  else lista = await pedir(`${REST()}/v_puntos_ayuda?select=*&order=departamento.asc`, { headers: encabezados() });

  const t = (busqueda || '').trim().toLowerCase();
  return lista.filter(p => {
    if (tipo && p.tipo !== tipo) return false;
    if (departamento && p.departamento !== departamento) return false;
    if (t && !`${p.nombre} ${p.entidad || ''} ${p.municipio || ''} ${p.notas || ''}`.toLowerCase().includes(t)) return false;
    return true;
  });
}

export async function traerEstadisticas() {
  if (MODO_DEMO) { await esperar(120); return ESTADISTICAS_DEMO; }
  const r = await pedir(`${REST()}/v_estadisticas?select=*&limit=1`, { headers: encabezados() });
  return (r && r[0]) || { profesionales: 0, voluntarios: 0, casos_abiertos: 0, casos_resueltos: 0, apadrinamientos: 0 };
}

/* ------------------------------------------------------------------ */
/* Escrituras públicas                                                 */
/* ------------------------------------------------------------------ */

/* Nota: el público no puede LEER las tablas base, así que las inserciones
   se hacen con Prefer: return=minimal (sin cláusula RETURNING). */
async function insertar(tabla, fila) {
  if (MODO_DEMO) {
    await esperar(650);
    return { ...fila, id: 'demo-' + Math.random().toString(36).slice(2, 9), _demo: true };
  }
  await pedir(`${REST()}/${tabla}`, {
    method: 'POST',
    headers: encabezados({ Prefer: 'return=minimal' }),
    body: JSON.stringify(fila)
  });
  return { ok: true };
}

export const registrarProfesional  = (d) => insertar('profesionales',   { ...d, estado: 'pendiente' });
export const registrarVoluntario   = (d) => insertar('voluntarios',     { ...d, estado: 'pendiente' });
export const proponerApadrinamiento= (d) => insertar('apadrinamientos', { ...d, estado: 'propuesto' });
export const proponerPuntoAyuda    = (d) => insertar('puntos_ayuda',    { ...d, estado: 'pendiente' });

/** Los casos se registran por función, para poder devolver el código a la familia. */
export async function registrarCaso(d) {
  if (MODO_DEMO) {
    await esperar(650);
    return { codigo: 'SOS-' + Math.floor(1000 + Math.random() * 9000), _demo: true };
  }
  const codigo = await pedir(`${REST()}/rpc/registrar_caso`, {
    method: 'POST',
    headers: encabezados(),
    body: JSON.stringify({ datos: d })
  });
  return { codigo: typeof codigo === 'string' ? codigo : (codigo && codigo.codigo) || null };
}

/** Confirma si un correo pertenece a alguien ya inscrito y aprobado. */
export async function verificarRegistro(email) {
  if (MODO_DEMO) {
    await esperar(400);
    const p = PROFESIONALES_DEMO.find(x => x.nombre.toLowerCase().includes((email || '').split('@')[0].toLowerCase()));
    return p ? { registrado: true, perfil: 'profesional', nombre: p.nombre, profesion: p.profesion } : null;
  }
  const r = await pedir(`${REST()}/rpc/verificar_registro`, {
    method: 'POST', headers: encabezados(), body: JSON.stringify({ p_email: email })
  });
  return (r && r[0]) || null;
}

/* ------------------------------------------------------------------ */
/* Fotografías                                                         */
/* ------------------------------------------------------------------ */

/** Sube un archivo al bucket "casos" y devuelve su URL pública. */
export async function subirFoto(archivo, carpeta = 'casos') {
  if (MODO_DEMO) {
    await esperar(400);
    return URL.createObjectURL(archivo);
  }
  const ext = (archivo.name.split('.').pop() || 'jpg').toLowerCase();
  const nombre = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const s = sesion.leer();
  const token = (s && s.access_token) ? s.access_token : CONFIG.SUPABASE_ANON_KEY;

  const r = await fetch(`${STORAGE()}/object/casos/${nombre}`, {
    method: 'POST',
    headers: {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': archivo.type || 'application/octet-stream',
      'x-upsert': 'true'
    },
    body: archivo
  });
  if (!r.ok) throw new Error('No fue posible subir la imagen. Intente con una foto más liviana.');
  return `${STORAGE()}/object/public/casos/${nombre}`;
}

/* ------------------------------------------------------------------ */
/* Moderación (requiere sesión de administrador)                       */
/* ------------------------------------------------------------------ */

export async function enviarEnlaceAcceso(email) {
  if (MODO_DEMO) { await esperar(500); return true; }
  await pedir(`${AUTH()}/otp`, {
    method: 'POST',
    headers: { apikey: CONFIG.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      create_user: false,
      options: { email_redirect_to: window.location.href.split('#')[0] }
    })
  });
  return true;
}

/** Lee el token que Supabase deja en la URL después del enlace mágico. */
export function capturarSesionDeUrl() {
  if (!window.location.hash.includes('access_token')) return null;
  const p = new URLSearchParams(window.location.hash.slice(1));
  const access_token = p.get('access_token');
  if (!access_token) return null;
  const s = {
    access_token,
    refresh_token: p.get('refresh_token'),
    expira_en: Date.now() + (parseInt(p.get('expires_in') || '3600', 10) * 1000),
    email: leerCorreoDelToken(access_token)
  };
  sesion.guardar(s);
  history.replaceState(null, '', window.location.pathname + window.location.search);
  return s;
}

function leerCorreoDelToken(token) {
  try {
    const carga = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return carga.email || '';
  } catch { return ''; }
}

export async function traerTodo(tabla, { estado } = {}) {
  if (MODO_DEMO) {
    await esperar(200);
    const fuentes = {
      casos: CASOS_DEMO, profesionales: PROFESIONALES_DEMO,
      voluntarios: VOLUNTARIOS_DEMO, puntos_ayuda: PUNTOS_DEMO, apadrinamientos: []
    };
    const l = [
      ...(PENDIENTES_DEMO[tabla] || []),
      ...(fuentes[tabla] || []).map(x => ({ estado: 'aprobado', ...x }))
    ];
    return estado ? l.filter(x => x.estado === estado) : l;
  }
  const filtro = estado ? `&estado=eq.${estado}` : '';
  return pedir(`${REST()}/${tabla}?select=*&order=creado_en.desc${filtro}`, { headers: encabezados() });
}

export async function cambiarEstado(tabla, id, estado, nota = null) {
  if (MODO_DEMO) { await esperar(350); return true; }
  await pedir(`${REST()}/${tabla}?id=eq.${id}`, {
    method: 'PATCH',
    headers: encabezados({ Prefer: 'return=minimal' }),
    body: JSON.stringify(nota ? { estado, nota_moderacion: nota } : { estado })
  });
  return true;
}

export async function eliminar(tabla, id) {
  if (MODO_DEMO) { await esperar(300); return true; }
  await pedir(`${REST()}/${tabla}?id=eq.${id}`, {
    method: 'DELETE', headers: encabezados({ Prefer: 'return=minimal' })
  });
  return true;
}

/* ------------------------------------------------------------------ */
/* Tablero público                                                     */
/* ------------------------------------------------------------------ */

export async function traerTablero() {
  if (MODO_DEMO) {
    await esperar(220);
    const publicos = CASOS_DEMO.filter(c => ['aprobado', 'resuelto'].includes(c.estado));

    const avance = {
      sin_padrino: publicos.filter(c => c.estado === 'aprobado' && !(c.padrinos || []).length).length,
      apadrinados: publicos.filter(c => c.estado === 'aprobado' && (c.padrinos || []).length).length,
      resueltos:   publicos.filter(c => c.estado === 'resuelto').length,
      personas:    publicos.reduce((s, c) => s + (c.personas_hogar || 0), 0),
      ninos:       publicos.reduce((s, c) => s + (c.ninos || 0), 0)
    };

    const porDepto = {};
    publicos.forEach(c => {
      const d = porDepto[c.departamento] || (porDepto[c.departamento] =
        { departamento: c.departamento, casos: 0, resueltos: 0, personas: 0, ninos: 0 });
      d.casos++;
      if (c.estado === 'resuelto') d.resueltos++;
      d.personas += c.personas_hogar || 0;
      d.ninos += c.ninos || 0;
    });

    const porNecesidad = {};
    publicos.forEach(c => (c.necesidades || []).forEach(n => {
      porNecesidad[n] = (porNecesidad[n] || 0) + 1;
    }));

    return {
      avance,
      departamentos: Object.values(porDepto).sort((a, b) => b.casos - a.casos),
      necesidades: Object.entries(porNecesidad)
        .map(([necesidad, casos]) => ({ necesidad, casos }))
        .sort((a, b) => b.casos - a.casos),
      estadisticas: ESTADISTICAS_DEMO
    };
  }

  const [avance, departamentos, necesidades, estadisticas] = await Promise.all([
    pedir(`${REST()}/v_tablero_avance?select=*&limit=1`, { headers: encabezados() }),
    pedir(`${REST()}/v_tablero_departamentos?select=*`, { headers: encabezados() }),
    pedir(`${REST()}/v_tablero_necesidades?select=*`, { headers: encabezados() }),
    traerEstadisticas()
  ]);

  return {
    avance: (avance && avance[0]) || { sin_padrino: 0, apadrinados: 0, resueltos: 0, personas: 0, ninos: 0 },
    departamentos: departamentos || [],
    necesidades: necesidades || [],
    estadisticas
  };
}

/** Deja constancia de que ya se avisó por WhatsApp. */
export async function marcarAvisado(tabla, id, campo = 'avisado_en') {
  if (MODO_DEMO) { await esperar(200); return true; }
  try {
    await pedir(`${REST()}/${tabla}?id=eq.${id}`, {
      method: 'PATCH',
      headers: encabezados({ Prefer: 'return=minimal' }),
      body: JSON.stringify({ [campo]: new Date().toISOString() })
    });
    return true;
  } catch {
    // La columna solo existe si ya se ejecutó 03_avisos_whatsapp.sql.
    return false;
  }
}

/** Consulta pública de un caso: código + últimos 4 dígitos del WhatsApp. */
export async function consultarCaso(codigo, telefono) {
  const cod = String(codigo || '').trim().toUpperCase();
  const dig = String(telefono || '').replace(/\D/g, '');

  if (MODO_DEMO) {
    await esperar(500);
    const todos = [...CASOS_DEMO, ...(PENDIENTES_DEMO.casos || [])];
    const c = todos.find(x => (x.codigo || '').toUpperCase() === cod);
    if (!c) return null;
    // En demostración se acepta cualquier número de 4 dígitos.
    if (dig.length < 4) return null;
    return {
      codigo: c.codigo, estado: c.estado || 'aprobado', titulo: c.titulo,
      creado_en: c.creado_en, municipio: c.municipio, departamento: c.departamento,
      urgencia: c.urgencia, necesidades: c.necesidades,
      padrinos: (c.padrinos || []).map(p => ({ ...p, telefono: '3009998877' })),
      nota_moderacion: null
    };
  }

  const r = await pedir(`${REST()}/rpc/consultar_caso`, {
    method: 'POST', headers: encabezados(),
    body: JSON.stringify({ p_codigo: cod, p_telefono: dig })
  });
  return (Array.isArray(r) ? r[0] : r) || null;
}
