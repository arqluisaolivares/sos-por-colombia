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
  /* --- Vivienda y obra --- */
  { id: 'evaluacion_estructural', nombre: 'Evaluar los daños de la vivienda' },
  { id: 'concepto_habitabilidad', nombre: 'Decir si la casa se puede habitar' },
  { id: 'planos',                 nombre: 'Hacer los planos de la vivienda' },
  { id: 'diseno_participativo',   nombre: 'Diseñar junto con la familia' },
  { id: 'reforzamiento',          nombre: 'Diseñar el reforzamiento estructural' },
  { id: 'licencias',              nombre: 'Tramitar licencias y curaduría' },
  { id: 'presupuesto',            nombre: 'Hacer el presupuesto y las cantidades' },
  { id: 'direccion_obra',         nombre: 'Dirigir técnicamente la obra' },
  { id: 'interventoria',          nombre: 'Hacer interventoría' },
  { id: 'mano_obra_calificada',   nombre: 'Poner mano de obra calificada' },
  { id: 'demolicion_segura',      nombre: 'Orientar demoliciones seguras' },

  /* --- Terreno y redes --- */
  { id: 'estudio_suelos',         nombre: 'Estudio de suelos' },
  { id: 'riesgo_ladera',          nombre: 'Evaluar riesgo de deslizamiento' },
  { id: 'levantamiento',          nombre: 'Levantamiento topográfico' },
  { id: 'replanteo',              nombre: 'Replanteo en terreno' },
  { id: 'linderos',               nombre: 'Aclarar linderos y áreas' },
  { id: 'redes_electricas',       nombre: 'Revisar y normalizar redes eléctricas' },
  { id: 'redes_hidraulicas',      nombre: 'Redes de agua y alcantarillado' },
  { id: 'agua_segura',            nombre: 'Agua potable y saneamiento' },

  /* --- Salud y acompañamiento --- */
  { id: 'salud',                  nombre: 'Consulta médica o de enfermería' },
  { id: 'brigadas_salud',         nombre: 'Brigadas de salud en terreno' },
  { id: 'apoyo_psicologico',      nombre: 'Apoyo psicológico individual' },
  { id: 'psicosocial_ninos',      nombre: 'Acompañamiento a niñas y niños' },
  { id: 'duelo',                  nombre: 'Acompañamiento en duelo' },
  { id: 'caracterizacion',        nombre: 'Caracterizar familias y necesidades' },
  { id: 'acompanamiento_familiar',nombre: 'Acompañamiento familiar continuo' },
  { id: 'veterinaria',            nombre: 'Atención de animales y mascotas' },

  /* --- Trámites y recursos --- */
  { id: 'asesoria_juridica',      nombre: 'Asesoría jurídica' },
  { id: 'gestion_subsidios',      nombre: 'Gestionar subsidios del Estado' },
  { id: 'titulacion',             nombre: 'Titulación y escrituras' },
  { id: 'seguros',                nombre: 'Reclamaciones ante aseguradoras' },
  { id: 'contabilidad_donaciones',nombre: 'Contabilidad de donaciones' },
  { id: 'tramites_tributarios',   nombre: 'Trámites tributarios de la Fundación' },

  /* --- Educación, comunicación y logística --- */
  { id: 'refuerzo_escolar',       nombre: 'Refuerzo escolar' },
  { id: 'espacios_ninos',         nombre: 'Espacios protectores para la niñez' },
  { id: 'formacion',              nombre: 'Formar y capacitar a la comunidad' },
  { id: 'comunicacion_campanas',  nombre: 'Comunicación y campañas' },
  { id: 'diseno_piezas',          nombre: 'Diseño de piezas gráficas' },
  { id: 'registro_fotografico',   nombre: 'Registro fotográfico y audiovisual' },
  { id: 'logistica_donaciones',   nombre: 'Logística de donaciones' },
  { id: 'transporte',             nombre: 'Transporte de materiales o personas' },
  { id: 'bodega',                 nombre: 'Bodega y clasificación' },
  { id: 'sistemas_datos',         nombre: 'Sistemas, datos y soporte técnico' },
  { id: 'censo_digital',          nombre: 'Censo digital en campo' }
];

/* Qué puede aportar cada profesión. Es una sugerencia, no una camisa de
   fuerza: en el formulario siempre se puede abrir la lista completa. */
export const SERVICIOS_POR_PROFESION = {
  arquitectura: ['evaluacion_estructural','concepto_habitabilidad','planos','diseno_participativo',
                 'licencias','presupuesto','direccion_obra','interventoria','formacion'],
  ingenieria_civil: ['evaluacion_estructural','concepto_habitabilidad','reforzamiento','direccion_obra',
                     'interventoria','presupuesto','demolicion_segura','estudio_suelos'],
  ingenieria_electrica: ['redes_electricas','evaluacion_estructural','formacion','direccion_obra'],
  ingenieria_sanitaria: ['redes_hidraulicas','agua_segura','presupuesto','direccion_obra'],
  topografia: ['levantamiento','replanteo','linderos','riesgo_ladera'],
  geotecnia: ['estudio_suelos','riesgo_ladera','evaluacion_estructural','concepto_habitabilidad'],
  construccion: ['mano_obra_calificada','direccion_obra','presupuesto','demolicion_segura','formacion'],
  medicina: ['salud','brigadas_salud','formacion'],
  psicologia: ['apoyo_psicologico','psicosocial_ninos','duelo','formacion'],
  trabajo_social: ['caracterizacion','acompanamiento_familiar','gestion_subsidios','espacios_ninos'],
  derecho: ['asesoria_juridica','gestion_subsidios','titulacion','seguros'],
  contaduria: ['contabilidad_donaciones','tramites_tributarios','presupuesto'],
  veterinaria: ['veterinaria','brigadas_salud'],
  educacion: ['refuerzo_escolar','espacios_ninos','psicosocial_ninos','formacion'],
  comunicacion: ['comunicacion_campanas','diseno_piezas','registro_fotografico'],
  logistica: ['logistica_donaciones','transporte','bodega','censo_digital'],
  sistemas: ['sistemas_datos','censo_digital','comunicacion_campanas'],
  otra: []
};

/** Servicios sugeridos para una profesión (vacío = mostrar todos). */
export function serviciosDe(profesion) {
  const ids = SERVICIOS_POR_PROFESION[profesion] || [];
  return ids.map(id => SERVICIOS.find(s => s.id === id)).filter(Boolean);
}

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
