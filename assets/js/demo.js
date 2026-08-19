/* =====================================================================
   SOS POR COLOMBIA · Datos de ejemplo (MODO DEMO)
   ---------------------------------------------------------------------
   Estos registros son FICTICIOS. Sirven para que el sitio se vea completo
   antes de conectar la base de datos. En cuanto usted llene config.js con
   los datos de Supabase, este archivo deja de usarse automáticamente.
   ===================================================================== */

export const CASOS_DEMO = [
  {
    id: 'demo-1', codigo: 'SOS-1001', creado_en: '2026-08-13T14:20:00Z',
    titulo: 'Casa de dos plantas colapsada en el barrio Milán',
    historia: 'Vivíamos con mis dos hijos y mi mamá en una casa de dos plantas que construimos hace veinte años. El sismo tumbó la segunda planta y agrietó los muros de carga de la primera. Los bomberos nos dijeron que no podemos volver a entrar. Estamos donde una vecina, en una sola habitación. Necesitamos que alguien nos diga si la estructura se puede recuperar o si hay que demoler, y si toca demoler necesitamos unos planos para volver a levantarla bien hecha.',
    departamento: 'Caldas', municipio: 'Manizales', barrio: 'Milán',
    personas_hogar: 5, ninos: 2, adultos_mayores: 1, personas_discapacidad: 0,
    estado_vivienda: 'inhabitable', tenencia: 'propia', urgencia: 'alta',
    necesidades: ['evaluacion', 'planos', 'albergue', 'enseres'],
    fotos: [], nombre_contacto: 'Marleny Ospina', telefono: '3105550101', nombre_publico: 'Marleny', estado: 'aprobado',
    padrinos: [
      { nombre: 'Arq. Camilo Restrepo', perfil: 'profesional', profesion: 'arquitectura',
        tipo_ayuda: ['evaluacion', 'planos'],
        compromiso: 'Visita técnica de evaluación y levantamiento de planos arquitectónicos para la reconstrucción.',
        estado: 'activo' }
    ]
  },
  {
    id: 'demo-2', codigo: 'SOS-1002', creado_en: '2026-08-14T09:05:00Z',
    titulo: 'Tres familias sin agua ni cocina en Quibdó',
    historia: 'Somos tres familias del mismo pasaje. Las casas quedaron en pie pero se reventaron los tanques y las tuberías, y el fogón quedó inservible. Estamos cocinando con leña en el andén y trayendo agua de una pila a cuatro cuadras. Hay siete niños entre los tres hogares.',
    departamento: 'Chocó', municipio: 'Quibdó', barrio: 'Niño Jesús',
    personas_hogar: 14, ninos: 7, adultos_mayores: 2, personas_discapacidad: 1,
    estado_vivienda: 'averiada', tenencia: 'propia', urgencia: 'alta',
    necesidades: ['agua', 'alimentos', 'materiales', 'mano_obra'],
    fotos: [], nombre_contacto: 'Yesid Palacios', telefono: '3115550102', nombre_publico: 'Yesid', estado: 'aprobado', padrinos: []
  },
  {
    id: 'demo-3', codigo: 'SOS-1003', creado_en: '2026-08-15T16:40:00Z',
    titulo: 'Taller de confección destruido, fuente de ingreso de la familia',
    historia: 'Mi taller de confección funcionaba en el primer piso de la casa. Se cayó el muro del fondo y las máquinas quedaron debajo del escombro. De ese taller vivíamos cinco personas y trabajaban otras dos vecinas. Necesito ayuda para retirar el escombro con seguridad y saber si el muro se puede levantar otra vez.',
    departamento: 'Risaralda', municipio: 'Pereira', barrio: 'Cuba',
    personas_hogar: 5, ninos: 1, adultos_mayores: 0, personas_discapacidad: 0,
    estado_vivienda: 'averiada', tenencia: 'propia', urgencia: 'media',
    necesidades: ['mano_obra', 'evaluacion', 'materiales'],
    fotos: [], nombre_contacto: 'Dora Cardona', telefono: '3125550103', nombre_publico: 'Dora', estado: 'aprobado',
    padrinos: [
      { nombre: 'Ing. Paula Grisales', perfil: 'profesional', profesion: 'ingenieria_civil',
        tipo_ayuda: ['evaluacion'],
        compromiso: 'Concepto técnico sobre el muro afectado y recomendaciones de apuntalamiento.',
        estado: 'activo' }
    ]
  },
  {
    id: 'demo-4', codigo: 'SOS-1004', creado_en: '2026-08-16T11:15:00Z',
    titulo: 'Adulta mayor sola, casa con riesgo de deslizamiento',
    historia: 'Mi tía tiene 78 años y vive sola. La casa no se cayó, pero el talud de atrás se agrietó y en cada réplica cae tierra sobre el patio. Ella no se quiere ir porque ahí vivió toda la vida. Necesitamos que un profesional evalúe el terreno y nos ayude a explicarle qué es seguro y qué no.',
    departamento: 'Valle del Cauca', municipio: 'Cali', barrio: 'Cámbulos',
    personas_hogar: 1, ninos: 0, adultos_mayores: 1, personas_discapacidad: 0,
    estado_vivienda: 'en_riesgo', tenencia: 'propia', urgencia: 'alta',
    necesidades: ['evaluacion', 'psicologico', 'albergue'],
    fotos: [], nombre_contacto: 'Adriana Bonilla', telefono: '3135550104', nombre_publico: 'Adriana', estado: 'aprobado', padrinos: []
  },
  {
    id: 'demo-5', codigo: 'SOS-1005', creado_en: '2026-08-12T08:00:00Z',
    titulo: 'Escuela veredal sin techo: 60 niños sin clases',
    historia: 'La única escuela de la vereda perdió la cubierta y dos salones. Sesenta niños llevan una semana sin clase. La comunidad puede poner la mano de obra, pero no tenemos ni el diseño ni los materiales de la cubierta.',
    departamento: 'Chocó', municipio: 'San José del Palmar', barrio: 'Vereda La Italia',
    personas_hogar: 0, ninos: 0, adultos_mayores: 0, personas_discapacidad: 0,
    estado_vivienda: 'averiada', tenencia: 'posesion', urgencia: 'media',
    necesidades: ['materiales', 'planos', 'escolar', 'mano_obra'],
    fotos: [], nombre_contacto: 'Junta de Acción Comunal', telefono: '3145550105', nombre_publico: 'Comunidad', estado: 'resuelto',
    padrinos: [
      { nombre: 'Fundación Profesionales Amigos', perfil: 'organizacion', profesion: null,
        tipo_ayuda: ['planos', 'materiales'],
        compromiso: 'Diseño de la cubierta metálica y gestión de la donación de materiales.',
        estado: 'completado' }
    ]
  },
  {
    id: 'demo-6', codigo: 'SOS-1006', creado_en: '2026-08-17T19:30:00Z',
    titulo: 'Familia con recién nacido durmiendo en carpa',
    historia: 'Mi hija dio a luz cuatro días antes del temblor. La casa quedó con la fachada partida y el ingeniero del municipio la marcó en rojo. Estamos en una carpa en la cancha del barrio. Lo urgente es un lugar seco y limpio para la bebé.',
    departamento: 'Quindío', municipio: 'Armenia', barrio: 'La Clarita',
    personas_hogar: 4, ninos: 1, adultos_mayores: 1, personas_discapacidad: 0,
    estado_vivienda: 'inhabitable', tenencia: 'arriendo', urgencia: 'alta',
    necesidades: ['albergue', 'enseres', 'salud', 'alimentos'],
    fotos: [], nombre_contacto: 'Sandra Ramírez', telefono: '3155550106', nombre_publico: 'Sandra', estado: 'aprobado', padrinos: []
  }
];

export const PROFESIONALES_DEMO = [
  { id: 'p1', nombre: 'Arq. Camilo Restrepo', profesion: 'arquitectura', anos_experiencia: 14,
    ciudad: 'Manizales', departamento: 'Caldas', zonas_atencion: ['Caldas', 'Risaralda', 'Quindío'],
    modalidad: 'mixta', disponibilidad: 'Entre 8 y 20 horas por semana', tiene_matricula: true,
    servicios: ['evaluacion_estructural', 'planos', 'licencias'],
    descripcion: 'Vivienda de interés social y patrimonio. Puedo hacer visitas de evaluación y levantamiento de planos para reconstrucción.' },
  { id: 'p2', nombre: 'Ing. Paula Grisales', profesion: 'ingenieria_civil', anos_experiencia: 9,
    ciudad: 'Pereira', departamento: 'Risaralda', zonas_atencion: ['Risaralda', 'Valle del Cauca'],
    modalidad: 'presencial', disponibilidad: 'Solo fines de semana', tiene_matricula: true,
    servicios: ['evaluacion_estructural', 'reforzamiento', 'direccion_obra'],
    descripcion: 'Estructuras en concreto y mampostería confinada. Emito conceptos técnicos sin costo para familias damnificadas.' },
  { id: 'p3', nombre: 'Psic. Daniela Mosquera', profesion: 'psicologia', anos_experiencia: 6,
    ciudad: 'Quibdó', departamento: 'Chocó', zonas_atencion: ['Chocó'],
    modalidad: 'mixta', disponibilidad: 'Entre 4 y 8 horas por semana', tiene_matricula: true,
    servicios: ['apoyo_psicologico', 'formacion'],
    descripcion: 'Atención en duelo y primeros auxilios psicológicos, con enfoque comunitario e intercultural.' },
  { id: 'p4', nombre: 'Abg. Hernán Ceballos', profesion: 'derecho', anos_experiencia: 18,
    ciudad: 'Cali', departamento: 'Valle del Cauca', zonas_atencion: ['Valle del Cauca', 'Cauca'],
    modalidad: 'remota', disponibilidad: 'Por jornadas puntuales', tiene_matricula: true,
    servicios: ['asesoria_juridica', 'gestion_subsidios'],
    descripcion: 'Derecho de vivienda, titulación y acceso a subsidios del Estado para damnificados.' },
  { id: 'p5', nombre: 'Top. Jorge Bermúdez', profesion: 'topografia', anos_experiencia: 22,
    ciudad: 'Armenia', departamento: 'Quindío', zonas_atencion: ['Quindío', 'Risaralda', 'Valle del Cauca'],
    modalidad: 'presencial', disponibilidad: 'Entre 4 y 8 horas por semana', tiene_matricula: true,
    servicios: ['evaluacion_estructural', 'presupuesto'],
    descripcion: 'Levantamientos topográficos y replanteo para reconstrucción de viviendas.' },
  { id: 'p6', nombre: 'Dra. Ana María Lozano', profesion: 'medicina', anos_experiencia: 11,
    ciudad: 'Bogotá D.C.', departamento: 'Bogotá D.C.', zonas_atencion: ['Chocó', 'Valle del Cauca'],
    modalidad: 'mixta', disponibilidad: 'Por jornadas puntuales', tiene_matricula: true,
    servicios: ['salud'],
    descripcion: 'Medicina general. Disponible para brigadas de salud de fin de semana en zona afectada.' }
];

export const VOLUNTARIOS_DEMO = [
  { id: 'v1', nombre: 'Wilson Arboleda', oficio: 'Maestro de obra',
    habilidades: ['mamposteria', 'obra_gris', 'demolicion'],
    ciudad: 'Pereira', departamento: 'Risaralda', zonas_atencion: ['Risaralda', 'Quindío'],
    disponibilidad: 'Solo fines de semana', tiene_vehiculo: false,
    descripcion: 'Treinta años pegando bloque. Puedo enseñarle a la gente del barrio a levantar muros bien confinados.' },
  { id: 'v2', nombre: 'Lucía Palacios', oficio: 'Cocinera',
    habilidades: ['cocina', 'bodega', 'cuidado_ninos'],
    ciudad: 'Quibdó', departamento: 'Chocó', zonas_atencion: ['Chocó'],
    disponibilidad: 'Jornada completa', tiene_vehiculo: false,
    descripcion: 'Coordino la olla comunitaria del barrio. Puedo organizar cocinas colectivas en albergues.' },
  { id: 'v3', nombre: 'Édinson Rúa', oficio: 'Conductor de camión',
    habilidades: ['conduccion', 'transporte_carga', 'bodega'],
    ciudad: 'Cali', departamento: 'Valle del Cauca', zonas_atencion: ['Valle del Cauca', 'Cauca', 'Chocó'],
    disponibilidad: 'Por jornadas puntuales', tiene_vehiculo: true, tipo_vehiculo: 'Camión sencillo 5 toneladas',
    descripcion: 'Pongo el camión y el combustible lo asumo si el trayecto es dentro del Valle.' },
  { id: 'v4', nombre: 'Karen Muñoz', oficio: 'Estudiante de enfermería',
    habilidades: ['primeros_auxilios', 'censo', 'cuidado_mayores'],
    ciudad: 'Manizales', departamento: 'Caldas', zonas_atencion: ['Caldas'],
    disponibilidad: 'Entre 8 y 20 horas por semana', tiene_vehiculo: false,
    descripcion: 'Apoyo en toma de signos, curaciones básicas y acompañamiento a adultos mayores en albergues.' },
  { id: 'v5', nombre: 'Miguel Tascón', oficio: 'Electricista',
    habilidades: ['electricidad', 'plomeria'],
    ciudad: 'Armenia', departamento: 'Quindío', zonas_atencion: ['Quindío', 'Valle del Cauca'],
    disponibilidad: 'Entre 4 y 8 horas por semana', tiene_vehiculo: true, tipo_vehiculo: 'Motocicleta',
    descripcion: 'Revisión y reconexión segura de instalaciones eléctricas en casas averiadas.' }
];

export const PUNTOS_DEMO = [
  { id: 'a1', nombre: 'Línea única de emergencias 123', tipo: 'salud',
    entidad: 'Policía, Bomberos, Ambulancias y Defensa Civil',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '123',
    notas: 'Primera línea para reportar personas atrapadas o heridas, incendios y colapsos de estructuras.' },
  { id: 'a2', nombre: 'Cruz Roja Colombiana', tipo: 'salud', entidad: 'Cruz Roja Colombiana',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '132',
    notas: 'Atención prehospitalaria y programa de Restablecimiento del Contacto Familiar. Correo: rcf@cruzrojacolombiana.org · Celular: 321 213 9525',
    enlace: 'https://www.cruzrojacolombiana.org' },
  { id: 'a3', nombre: 'Defensa Civil Colombiana', tipo: 'estructural', entidad: 'Defensa Civil Colombiana',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '144',
    notas: 'Búsqueda y rescate, evacuación y apoyo en zonas de riesgo por réplicas.',
    enlace: 'https://www.defensacivil.gov.co' },
  { id: 'a4', nombre: 'Línea de atención de desastres', tipo: 'estructural',
    entidad: 'Sistema Nacional de Gestión del Riesgo',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '111',
    notas: 'Reporte de daños en infraestructura y solicitudes de ayuda humanitaria.',
    enlace: 'https://portal.gestiondelriesgo.gov.co' },
  { id: 'a5', nombre: 'Colombia te busca', tipo: 'psicosocial',
    entidad: 'Plataforma ciudadana en coordinación con Cruz Roja',
    departamento: 'Nacional', municipio: 'Todo el país', horario: 'Permanente',
    notas: 'Registro y consulta pública de personas desaparecidas por el sismo.',
    enlace: 'https://colombiatebusca.com/' },
  { id: 'a6', nombre: 'Coordinación de ayuda entre ciudades capitales', tipo: 'acopio', entidad: 'Asocapitales',
    departamento: 'Nacional', municipio: 'Todo el país', horario: 'Horario de oficina', telefono: '300 761 6647',
    notas: 'Canaliza donaciones y ayuda entre alcaldías de ciudades capitales.' },
  { id: 'a7', nombre: 'Bomberos', tipo: 'estructural', entidad: 'Cuerpo de Bomberos',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '119',
    notas: 'Incendios, fugas de gas y rescate en estructuras colapsadas.' },
  { id: 'a8', nombre: 'Línea 141 · Niñas, niños y adolescentes', tipo: 'psicosocial', entidad: 'ICBF',
    departamento: 'Nacional', municipio: 'Todo el país', horario: '24 horas', telefono: '141',
    notas: 'Protección de menores de edad separados de su familia o en riesgo.',
    enlace: 'https://www.icbf.gov.co' }
];

/* Registros "pendientes" para que el panel de moderación se pueda probar. */
export const PENDIENTES_DEMO = {
  casos: [{
    id: 'pend-c1', codigo: 'SOS-1007', creado_en: '2026-08-18T21:10:00Z', estado: 'pendiente',
    titulo: 'Techo de zinc arrancado, familia con tres niños',
    historia: 'El temblor tumbó el muro del vecino sobre nuestro techo. Se llevó las tejas y ahora se moja todo cuando llueve. Somos cinco, tres son niños pequeños.',
    nombre_contacto: 'Yenifer Ordóñez', telefono: '310 555 0142', email: 'yenifer.demo@correo.com',
    direccion: 'Calle 12 # 4-30 (dato reservado)',
    departamento: 'Cauca', municipio: 'Popayán', barrio: 'La Esmeralda',
    personas_hogar: 5, ninos: 3, adultos_mayores: 0, personas_discapacidad: 0,
    estado_vivienda: 'averiada', tenencia: 'arriendo', urgencia: 'alta',
    necesidades: ['materiales', 'mano_obra', 'albergue'], fotos: []
  }],
  profesionales: [{
    id: 'pend-p1', creado_en: '2026-08-18T15:00:00Z', estado: 'pendiente',
    nombre: 'Ing. Sebastián Ocampo', profesion: 'ingenieria_electrica', matricula: 'EL-45123',
    anos_experiencia: 7, email: 'sebastian.demo@correo.com', telefono: '312 555 0198',
    ciudad: 'Cali', departamento: 'Valle del Cauca', zonas_atencion: ['Valle del Cauca', 'Cauca'],
    modalidad: 'presencial', disponibilidad: 'Solo fines de semana', servicios: ['redes'],
    descripcion: 'Revisión y normalización de instalaciones eléctricas en viviendas afectadas.'
  }],
  voluntarios: [{
    id: 'pend-v1', creado_en: '2026-08-18T18:40:00Z', estado: 'pendiente',
    nombre: 'Marta Cifuentes', oficio: 'Docente jubilada',
    habilidades: ['cuidado_ninos', 'censo'], email: 'marta.demo@correo.com', telefono: '311 555 0177',
    ciudad: 'Manizales', departamento: 'Caldas', zonas_atencion: ['Caldas'],
    disponibilidad: 'Jornada completa', tiene_vehiculo: false,
    descripcion: 'Puedo organizar actividades con los niños en los albergues mientras los papás gestionan.'
  }],
  apadrinamientos: [{
    id: 'pend-a1', creado_en: '2026-08-18T22:05:00Z', estado: 'propuesto',
    caso_id: 'demo-2', nombre: 'Ferretería El Tornillo', perfil: 'organizacion',
    email: 'eltornillo.demo@correo.com', telefono: '313 555 0165',
    tipo_ayuda: ['materiales'], compromiso: 'Donación de tubería y accesorios para reconectar el agua de las tres viviendas.',
    plazo: 'Esta semana'
  }],
  puntos_ayuda: [{
    id: 'pend-pa1', creado_en: '2026-08-18T13:20:00Z', estado: 'pendiente',
    nombre: 'Punto de acopio Coliseo Municipal', tipo: 'acopio', entidad: 'Alcaldía municipal',
    departamento: 'Risaralda', municipio: 'Pereira', direccion: 'Coliseo Municipal, entrada norte',
    horario: 'Lunes a sábado, 8 a. m. a 6 p. m.', telefono: '606 555 0100',
    notas: 'Reciben mercados, cobijas y elementos de aseo.'
  }]
};

export const ESTADISTICAS_DEMO = {
  profesionales: PROFESIONALES_DEMO.length,
  voluntarios: VOLUNTARIOS_DEMO.length,
  casos_abiertos: CASOS_DEMO.filter(c => c.estado === 'aprobado').length,
  casos_resueltos: CASOS_DEMO.filter(c => c.estado === 'resuelto').length,
  apadrinamientos: CASOS_DEMO.reduce((n, c) => n + (c.padrinos ? c.padrinos.length : 0), 0)
};
