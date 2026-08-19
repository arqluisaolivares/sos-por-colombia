/* =====================================================================
   SOS POR COLOMBIA · Catálogos
   Listas que alimentan los formularios y los filtros.
   Puede agregar o quitar opciones libremente.
   ===================================================================== */

/* Departamentos priorizados por el sismo del 10 de agosto de 2026,
   seguidos del resto del país. */
export const DEPARTAMENTOS_AFECTADOS = [
  'Chocó', 'Valle del Cauca', 'Risaralda', 'Caldas', 'Quindío',
  'Antioquia', 'Cauca', 'Nariño', 'Tolima', 'Putumayo'
];

export const DEPARTAMENTOS = [
  ...DEPARTAMENTOS_AFECTADOS,
  'Amazonas', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
  'Casanare', 'Cesar', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
  'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Norte de Santander',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Vaupés', 'Vichada'
];

export const PROFESIONES = [
  { id: 'arquitectura',        nombre: 'Arquitectura' },
  { id: 'ingenieria_civil',    nombre: 'Ingeniería civil / estructural' },
  { id: 'ingenieria_electrica',nombre: 'Ingeniería eléctrica' },
  { id: 'ingenieria_sanitaria',nombre: 'Ingeniería hidráulica y sanitaria' },
  { id: 'topografia',          nombre: 'Topografía' },
  { id: 'geotecnia',           nombre: 'Geología / geotecnia' },
  { id: 'construccion',        nombre: 'Construcción y maestría de obra' },
  { id: 'medicina',            nombre: 'Medicina y enfermería' },
  { id: 'psicologia',          nombre: 'Psicología / atención psicosocial' },
  { id: 'trabajo_social',      nombre: 'Trabajo social' },
  { id: 'derecho',             nombre: 'Derecho' },
  { id: 'contaduria',          nombre: 'Contaduría y finanzas' },
  { id: 'veterinaria',         nombre: 'Veterinaria' },
  { id: 'educacion',           nombre: 'Educación y pedagogía' },
  { id: 'comunicacion',        nombre: 'Comunicación y diseño' },
  { id: 'logistica',           nombre: 'Logística y cadena de suministro' },
  { id: 'sistemas',            nombre: 'Sistemas y tecnología' },
  { id: 'otra',                nombre: 'Otra profesión' }
];

export const SERVICIOS = [
  { id: 'evaluacion_estructural', nombre: 'Evaluación de daños en la vivienda' },
  { id: 'planos',                 nombre: 'Planos y diseño de vivienda' },
  { id: 'licencias',              nombre: 'Trámites y licencias de construcción' },
  { id: 'presupuesto',            nombre: 'Presupuesto y cantidades de obra' },
  { id: 'direccion_obra',         nombre: 'Dirección técnica de obra' },
  { id: 'reforzamiento',          nombre: 'Reforzamiento estructural' },
  { id: 'redes',                  nombre: 'Redes eléctricas e hidrosanitarias' },
  { id: 'salud',                  nombre: 'Atención en salud' },
  { id: 'apoyo_psicologico',      nombre: 'Apoyo psicológico' },
  { id: 'asesoria_juridica',      nombre: 'Asesoría jurídica' },
  { id: 'gestion_subsidios',      nombre: 'Gestión de subsidios y ayudas del Estado' },
  { id: 'formacion',              nombre: 'Formación y acompañamiento a la comunidad' }
];

export const HABILIDADES = [
  { id: 'mamposteria',   nombre: 'Pega de bloque / mampostería' },
  { id: 'obra_gris',     nombre: 'Obra gris y acabados' },
  { id: 'carpinteria',   nombre: 'Carpintería' },
  { id: 'soldadura',     nombre: 'Soldadura y estructura metálica' },
  { id: 'electricidad',  nombre: 'Electricidad' },
  { id: 'plomeria',      nombre: 'Plomería' },
  { id: 'pintura',       nombre: 'Pintura' },
  { id: 'demolicion',    nombre: 'Remoción de escombros' },
  { id: 'conduccion',    nombre: 'Conducción / transporte' },
  { id: 'cocina',        nombre: 'Cocina y preparación de alimentos' },
  { id: 'primeros_auxilios', nombre: 'Primeros auxilios' },
  { id: 'cuidado_ninos', nombre: 'Cuidado de niñas y niños' },
  { id: 'cuidado_mayores', nombre: 'Acompañamiento a adultos mayores' },
  { id: 'bodega',        nombre: 'Bodega y clasificación de donaciones' },
  { id: 'censo',         nombre: 'Censo y toma de datos en campo' },
  { id: 'traduccion',    nombre: 'Lenguas indígenas / traducción' },
  { id: 'comunicacion',  nombre: 'Redes sociales y comunicación' },
  { id: 'transporte_carga', nombre: 'Vehículo de carga propio' }
];

export const NECESIDADES = [
  { id: 'alimentos',    nombre: 'Alimentos',                icono: '🍲' , svg: 'olla' },
  { id: 'agua',         nombre: 'Agua potable',             icono: '💧' , svg: 'gota' },
  { id: 'albergue',     nombre: 'Techo temporal',           icono: '⛺' , svg: 'carpa' },
  { id: 'materiales',   nombre: 'Materiales de construcción', icono: '🧱' , svg: 'ladrillos' },
  { id: 'planos',       nombre: 'Planos y diseño',          icono: '📐' , svg: 'escuadra' },
  { id: 'evaluacion',   nombre: 'Evaluación estructural',   icono: '🏚️' , svg: 'lupa-casa' },
  { id: 'mano_obra',    nombre: 'Mano de obra',             icono: '🔨' , svg: 'herramienta' },
  { id: 'salud',        nombre: 'Atención médica',          icono: '⚕️' , svg: 'salud' },
  { id: 'psicologico',  nombre: 'Apoyo psicológico',        icono: '💙' , svg: 'corazon' },
  { id: 'juridico',     nombre: 'Asesoría jurídica',        icono: '⚖️' , svg: 'balanza' },
  { id: 'enseres',      nombre: 'Enseres y cocina',         icono: '🛏️' , svg: 'cama' },
  { id: 'ropa',         nombre: 'Ropa y cobijas',           icono: '🧥' , svg: 'camiseta' },
  { id: 'escolar',      nombre: 'Útiles escolares',         icono: '🎒' , svg: 'mochila' },
  { id: 'mascotas',     nombre: 'Atención de mascotas',     icono: '🐕' , svg: 'huella' },
  { id: 'transporte',   nombre: 'Transporte',               icono: '🚚', svg: 'camion' }
];

export const ESTADOS_VIVIENDA = [
  { id: 'destruida',   nombre: 'Destruida / colapsada' },
  { id: 'inhabitable', nombre: 'En pie pero inhabitable' },
  { id: 'averiada',    nombre: 'Averiada, habitable con reparaciones' },
  { id: 'en_riesgo',   nombre: 'En riesgo por el terreno o por una edificación vecina' },
  { id: 'sin_evaluar', nombre: 'Aún no ha sido evaluada' }
];

export const TENENCIAS = [
  { id: 'propia',    nombre: 'Propia' },
  { id: 'arriendo',  nombre: 'En arriendo' },
  { id: 'familiar',  nombre: 'De un familiar' },
  { id: 'posesion',  nombre: 'En posesión, sin escritura' }
];

export const TIPOS_PUNTO = [
  { id: 'acopio',       nombre: 'Punto de acopio',            icono: '📦' , svg: 'ubicacion' },
  { id: 'albergue',     nombre: 'Albergue temporal',          icono: '⛺' , svg: 'carpa' },
  { id: 'alimentacion', nombre: 'Comedor / alimentación',     icono: '🍲' , svg: 'olla' },
  { id: 'agua',         nombre: 'Agua potable',               icono: '💧' , svg: 'gota' },
  { id: 'salud',        nombre: 'Atención en salud',          icono: '⚕️' , svg: 'salud' },
  { id: 'estructural',  nombre: 'Evaluación estructural',     icono: '🏗️' , svg: 'lupa-casa' },
  { id: 'juridica',     nombre: 'Orientación jurídica',       icono: '⚖️' , svg: 'balanza' },
  { id: 'psicosocial',  nombre: 'Apoyo psicosocial',          icono: '💙', svg: 'corazon' }
];

export const MODALIDADES = [
  { id: 'presencial', nombre: 'Presencial' },
  { id: 'remota',     nombre: 'Remota' },
  { id: 'mixta',      nombre: 'Presencial y remota' }
];

export const DISPONIBILIDADES = [
  'Menos de 4 horas por semana',
  'Entre 4 y 8 horas por semana',
  'Entre 8 y 20 horas por semana',
  'Jornada completa',
  'Solo fines de semana',
  'Por jornadas puntuales'
];

/* Cifras oficiales del evento — actualícelas cuando cambien los reportes. */
export const CIFRAS_EVENTO = {
  fecha: '10 de agosto de 2026',
  magnitud: '7,4',
  epicentro: 'San José del Palmar, Chocó',
  municipios: '472',
  familias: '123.789',
  personas: '292.043',
  fuente: 'UNGRD · reporte del 18 de agosto de 2026'
};

/* Utilidades de traducción id -> nombre */
const mapa = (lista) => Object.fromEntries(lista.map(o => [o.id, o]));
export const M_PROFESIONES = mapa(PROFESIONES);
export const M_SERVICIOS   = mapa(SERVICIOS);
export const M_HABILIDADES = mapa(HABILIDADES);
export const M_NECESIDADES = mapa(NECESIDADES);
export const M_VIVIENDA    = mapa(ESTADOS_VIVIENDA);
export const M_TENENCIA    = mapa(TENENCIAS);
export const M_TIPOS_PUNTO = mapa(TIPOS_PUNTO);

export const nombreDe = (mapaRef, id, respaldo = '') =>
  (mapaRef[id] && mapaRef[id].nombre) || respaldo || id || '';
