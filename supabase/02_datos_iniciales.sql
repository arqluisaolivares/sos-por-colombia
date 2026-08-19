-- =====================================================================
--  SOS POR COLOMBIA  ·  Datos iniciales
--  Ejecute este archivo DESPUÉS de 01_esquema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMINISTRADORES
--    ⚠️ CAMBIE ESTE CORREO por el suyo antes de ejecutar.
--    Agregue una línea por cada moderador de la plataforma.
-- ---------------------------------------------------------------------
insert into public.admins (email, nombre) values
  ('arqluisaolivares@gmail.com', 'Luisa Olivares Bermúdez')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------
-- 2. CANALES OFICIALES DE ATENCIÓN
--    Líneas nacionales verificadas tras el sismo del 10 de agosto de 2026.
--    Los puntos de acopio y albergues locales se agregan desde el
--    Panel de moderación del sitio, a medida que se confirmen.
-- ---------------------------------------------------------------------
insert into public.puntos_ayuda
  (nombre, tipo, entidad, departamento, municipio, direccion, horario, telefono, notas, enlace)
values
  ('Línea única de emergencias 123', 'salud', 'Policía, Bomberos, Ambulancias y Defensa Civil',
   'Nacional', 'Todo el país', null, '24 horas', '123',
   'Primera línea para reportar personas atrapadas o heridas, incendios y colapsos de estructuras.', null),

  ('Cruz Roja Colombiana', 'salud', 'Cruz Roja Colombiana',
   'Nacional', 'Todo el país', null, '24 horas', '132',
   'Atención prehospitalaria y programa de Restablecimiento del Contacto Familiar para localizar seres queridos. Correo: rcf@cruzrojacolombiana.org · Celular: 321 213 9525', 'https://www.cruzrojacolombiana.org'),

  ('Defensa Civil Colombiana', 'estructural', 'Defensa Civil Colombiana',
   'Nacional', 'Todo el país', null, '24 horas', '144',
   'Búsqueda y rescate, evacuación y apoyo en zonas de riesgo por réplicas.', 'https://www.defensacivil.gov.co'),

  ('Línea de atención de desastres', 'estructural', 'Sistema Nacional de Gestión del Riesgo',
   'Nacional', 'Todo el país', null, '24 horas', '111',
   'Reporte de daños en infraestructura y solicitudes de ayuda humanitaria.', 'https://portal.gestiondelriesgo.gov.co'),

  ('Colombia te busca', 'psicosocial', 'Plataforma ciudadana en coordinación con Cruz Roja',
   'Nacional', 'Todo el país', null, 'Permanente', null,
   'Registro y consulta pública de personas desaparecidas por el sismo: datos, ubicación y fotografía reciente.', 'https://colombiatebusca.com/'),

  ('Coordinación de ayuda entre ciudades capitales', 'acopio', 'Asocapitales',
   'Nacional', 'Todo el país', null, 'Horario de oficina', '300 761 6647',
   'Canaliza donaciones y ayuda entre alcaldías de ciudades capitales.', null),

  ('Bomberos', 'estructural', 'Cuerpo de Bomberos',
   'Nacional', 'Todo el país', null, '24 horas', '119',
   'Atención de incendios, fugas de gas y rescate en estructuras colapsadas.', null),

  ('Línea 141 · Niñas, niños y adolescentes', 'psicosocial', 'ICBF',
   'Nacional', 'Todo el país', null, '24 horas', '141',
   'Protección de menores de edad separados de su familia o en riesgo.', 'https://www.icbf.gov.co')
on conflict (nombre, municipio) do nothing;

-- =====================================================================
--  FIN
-- =====================================================================
