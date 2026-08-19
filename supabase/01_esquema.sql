-- =====================================================================
--  SOS POR COLOMBIA  ·  Esquema de base de datos (Supabase / PostgreSQL)
--  Fundación Profesionales Amigos
--  Sismo del 10 de agosto de 2026
--
--  CÓMO USARLO
--  1. Entre a su proyecto en https://supabase.com
--  2. Menú lateral -> SQL Editor -> New query
--  3. Copie y pegue TODO este archivo y presione RUN
--  4. Luego ejecute el archivo 02_datos_iniciales.sql
--
--  PRINCIPIO DE SEGURIDAD
--  Las tablas base NO son legibles por el público. El sitio web solo lee
--  VISTAS públicas que ocultan teléfonos, correos y direcciones exactas,
--  y que únicamente muestran registros con estado = 'aprobado'.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Extensiones
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Permite volver a ejecutar este archivo sin errores: retira las políticas
-- de seguridad creadas en una ejecución anterior antes de volver a crearlas.
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admins','profesionales','voluntarios','casos','apadrinamientos','puntos_ayuda')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 1. Administradores (moderadores de la plataforma)
--    Agregue aquí el correo de cada persona que podrá moderar.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email       text primary key,
  nombre      text,
  creado_en   timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Función auxiliar: ¿el usuario autenticado es administrador?
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create policy "admins se leen a sí mismos"
  on public.admins for select
  using (public.es_admin());

-- ---------------------------------------------------------------------
-- 2. PROFESIONALES
-- ---------------------------------------------------------------------
create table if not exists public.profesionales (
  id                uuid primary key default gen_random_uuid(),
  creado_en         timestamptz not null default now(),

  nombre            text not null,
  profesion         text not null,          -- arquitectura, ingenieria_civil, psicologia, ...
  otra_profesion    text,
  matricula         text,                   -- tarjeta / matrícula profesional
  anos_experiencia  integer,

  -- datos de contacto: PRIVADOS, nunca salen en la vista pública
  email             text not null,
  telefono          text not null,

  ciudad            text,
  departamento      text,
  zonas_atencion    text[]  not null default '{}',   -- departamentos donde puede atender
  modalidad         text,                            -- presencial | remota | mixta
  disponibilidad    text,                            -- ej. "8 horas por semana"
  servicios         text[]  not null default '{}',   -- planos, evaluacion_estructural, ...
  descripcion       text,
  enlace            text,                            -- portafolio / LinkedIn

  autoriza_datos    boolean not null default false,  -- Ley 1581 de 2012
  estado            text    not null default 'pendiente'
                    check (estado in ('pendiente','aprobado','rechazado')),
  nota_moderacion   text
);

create index if not exists idx_profesionales_estado on public.profesionales(estado);

-- ---------------------------------------------------------------------
-- 3. VOLUNTARIOS
-- ---------------------------------------------------------------------
create table if not exists public.voluntarios (
  id                uuid primary key default gen_random_uuid(),
  creado_en         timestamptz not null default now(),

  nombre            text not null,
  oficio            text,                            -- ej. "maestro de obra"
  habilidades       text[] not null default '{}',    -- mamposteria, conduccion, cocina, ...
  otra_habilidad    text,

  email             text not null,                   -- PRIVADO
  telefono          text not null,                   -- PRIVADO

  ciudad            text,
  departamento      text,
  zonas_atencion    text[] not null default '{}',
  disponibilidad    text,                            -- fines de semana | jornada completa | ...
  tiene_vehiculo    boolean not null default false,
  tipo_vehiculo     text,
  mayor_de_edad     boolean not null default false,
  descripcion       text,

  autoriza_datos    boolean not null default false,
  estado            text    not null default 'pendiente'
                    check (estado in ('pendiente','aprobado','rechazado')),
  nota_moderacion   text
);

create index if not exists idx_voluntarios_estado on public.voluntarios(estado);

-- ---------------------------------------------------------------------
-- 4. CASOS (familias damnificadas)
-- ---------------------------------------------------------------------
create sequence if not exists public.casos_consecutivo start 1001;

create table if not exists public.casos (
  id                    uuid primary key default gen_random_uuid(),
  creado_en             timestamptz not null default now(),
  codigo                text unique not null
                        default 'SOS-' || nextval('public.casos_consecutivo')::text,

  -- identificación de la familia
  nombre_contacto       text not null,
  parentesco            text,                     -- rol de quien reporta
  personas_hogar        integer,
  ninos                 integer default 0,
  adultos_mayores       integer default 0,
  personas_discapacidad integer default 0,

  -- contacto: PRIVADO
  telefono              text not null,
  email                 text,
  direccion             text,                     -- dirección exacta, PRIVADA

  -- ubicación pública (aproximada)
  departamento          text not null,
  municipio             text not null,
  barrio                text,

  -- el caso
  titulo                text not null,
  historia              text not null,
  estado_vivienda       text,                     -- destruida | inhabitable | averiada | en_riesgo
  tenencia              text,                     -- propia | arriendo | familiar | posesion
  urgencia              text not null default 'media'
                        check (urgencia in ('alta','media','baja')),
  necesidades           text[] not null default '{}',
  fotos                 jsonb  not null default '[]'::jsonb,  -- [{url, descripcion}]

  autoriza_datos        boolean not null default false,
  autoriza_fotos        boolean not null default false,

  estado                text not null default 'pendiente'
                        check (estado in ('pendiente','aprobado','rechazado','resuelto')),
  verificado_por        text,
  nota_moderacion       text
);

create index if not exists idx_casos_estado on public.casos(estado);
create index if not exists idx_casos_depto  on public.casos(departamento);

-- ---------------------------------------------------------------------
-- 5. APADRINAMIENTOS (un profesional o voluntario acompaña un caso)
-- ---------------------------------------------------------------------
create table if not exists public.apadrinamientos (
  id                uuid primary key default gen_random_uuid(),
  creado_en         timestamptz not null default now(),

  caso_id           uuid not null references public.casos(id) on delete cascade,

  -- quién apadrina (se valida contra el correo registrado)
  nombre            text not null,
  email             text not null,     -- PRIVADO
  telefono          text,              -- PRIVADO
  perfil            text not null default 'profesional'
                    check (perfil in ('profesional','voluntario','organizacion','persona')),
  profesion         text,

  tipo_ayuda        text[] not null default '{}',  -- planos, materiales, alimentos, ...
  compromiso        text not null,                 -- qué se compromete a hacer
  plazo             text,

  estado            text not null default 'propuesto'
                    check (estado in ('propuesto','activo','completado','cancelado')),
  nota_moderacion   text
);

create index if not exists idx_apadrinamientos_caso on public.apadrinamientos(caso_id);

-- ---------------------------------------------------------------------
-- 6. PUNTOS DE AYUDA (¿dónde consigo ayuda?)
-- ---------------------------------------------------------------------
create table if not exists public.puntos_ayuda (
  id            uuid primary key default gen_random_uuid(),
  creado_en     timestamptz not null default now(),
  nombre        text not null,
  tipo          text not null,      -- acopio | albergue | alimentacion | salud | juridica | estructural | psicosocial | agua
  entidad       text,
  departamento  text not null,
  municipio     text not null,
  direccion     text,
  horario       text,
  telefono      text,
  notas         text,
  enlace        text,
  estado        text not null default 'aprobado'
                check (estado in ('pendiente','aprobado','rechazado'))
);

create unique index if not exists ux_puntos_ayuda_nombre
  on public.puntos_ayuda (nombre, municipio);

-- =====================================================================
--  SEGURIDAD: Row Level Security
-- =====================================================================
alter table public.profesionales   enable row level security;
alter table public.voluntarios     enable row level security;
alter table public.casos           enable row level security;
alter table public.apadrinamientos enable row level security;
alter table public.puntos_ayuda    enable row level security;

-- Cualquiera puede INSCRIBIRSE / REPORTAR (pero siempre entra como 'pendiente')
create policy "cualquiera puede inscribirse como profesional"
  on public.profesionales for insert to anon, authenticated
  with check (estado = 'pendiente' and autoriza_datos = true);

create policy "cualquiera puede inscribirse como voluntario"
  on public.voluntarios for insert to anon, authenticated
  with check (estado = 'pendiente' and autoriza_datos = true);

create policy "cualquiera puede reportar un caso"
  on public.casos for insert to anon, authenticated
  with check (estado = 'pendiente' and autoriza_datos = true);

create policy "cualquiera puede proponer apadrinamiento"
  on public.apadrinamientos for insert to anon, authenticated
  with check (estado = 'propuesto');

create policy "cualquiera puede proponer un punto de ayuda"
  on public.puntos_ayuda for insert to anon, authenticated
  with check (estado = 'pendiente');

-- Nadie del público puede LEER las tablas base (solo las vistas de abajo).
-- Los administradores sí pueden leerlo y moderarlo todo.
create policy "admin lee profesionales"    on public.profesionales   for select using (public.es_admin());
create policy "admin edita profesionales"  on public.profesionales   for update using (public.es_admin()) with check (public.es_admin());
create policy "admin borra profesionales"  on public.profesionales   for delete using (public.es_admin());

create policy "admin lee voluntarios"      on public.voluntarios     for select using (public.es_admin());
create policy "admin edita voluntarios"    on public.voluntarios     for update using (public.es_admin()) with check (public.es_admin());
create policy "admin borra voluntarios"    on public.voluntarios     for delete using (public.es_admin());

create policy "admin lee casos"            on public.casos           for select using (public.es_admin());
create policy "admin edita casos"          on public.casos           for update using (public.es_admin()) with check (public.es_admin());
create policy "admin borra casos"          on public.casos           for delete using (public.es_admin());

create policy "admin lee apadrinamientos"  on public.apadrinamientos for select using (public.es_admin());
create policy "admin edita apadrinamientos" on public.apadrinamientos for update using (public.es_admin()) with check (public.es_admin());
create policy "admin borra apadrinamientos" on public.apadrinamientos for delete using (public.es_admin());

create policy "admin lee puntos"           on public.puntos_ayuda    for select using (public.es_admin());
create policy "admin edita puntos"         on public.puntos_ayuda    for update using (public.es_admin()) with check (public.es_admin());
create policy "admin borra puntos"         on public.puntos_ayuda    for delete using (public.es_admin());

-- =====================================================================
--  VISTAS PÚBLICAS
--  Solo registros aprobados y SIN datos de contacto.
--  (security_invoker = off: la vista se ejecuta con permisos del dueño,
--   por eso puede leer la tabla aunque el público no pueda.)
-- =====================================================================

create or replace view public.v_profesionales as
  select id, creado_en, nombre, profesion, otra_profesion, anos_experiencia,
         ciudad, departamento, zonas_atencion, modalidad, disponibilidad,
         servicios, descripcion, enlace,
         (matricula is not null and matricula <> '') as tiene_matricula
  from public.profesionales
  where estado = 'aprobado';

create or replace view public.v_voluntarios as
  select id, creado_en, nombre, oficio, habilidades, otra_habilidad,
         ciudad, departamento, zonas_atencion, disponibilidad,
         tiene_vehiculo, tipo_vehiculo, descripcion
  from public.voluntarios
  where estado = 'aprobado';

create or replace view public.v_casos as
  select c.id, c.creado_en, c.codigo, c.titulo, c.historia,
         c.departamento, c.municipio, c.barrio,
         c.personas_hogar, c.ninos, c.adultos_mayores, c.personas_discapacidad,
         c.estado_vivienda, c.tenencia, c.urgencia, c.necesidades,
         case when c.autoriza_fotos then c.fotos else '[]'::jsonb end as fotos,
         c.estado,
         -- nombre de pila únicamente, para proteger a la familia
         split_part(c.nombre_contacto, ' ', 1) as nombre_publico,
         coalesce(a.padrinos, '[]'::jsonb) as padrinos
  from public.casos c
  left join lateral (
      select jsonb_agg(jsonb_build_object(
               'nombre', ap.nombre,
               'perfil', ap.perfil,
               'profesion', ap.profesion,
               'tipo_ayuda', ap.tipo_ayuda,
               'compromiso', ap.compromiso,
               'estado', ap.estado)
             order by ap.creado_en) as padrinos
      from public.apadrinamientos ap
      where ap.caso_id = c.id and ap.estado in ('activo','completado')
  ) a on true
  where c.estado in ('aprobado','resuelto');

create or replace view public.v_puntos_ayuda as
  select id, nombre, tipo, entidad, departamento, municipio,
         direccion, horario, telefono, notas, enlace
  from public.puntos_ayuda
  where estado = 'aprobado';

-- Tablero de cifras para la portada (sin exponer datos personales)
create or replace view public.v_estadisticas as
  select
    (select count(*) from public.profesionales where estado = 'aprobado')            as profesionales,
    (select count(*) from public.voluntarios   where estado = 'aprobado')            as voluntarios,
    (select count(*) from public.casos         where estado = 'aprobado')            as casos_abiertos,
    (select count(*) from public.casos         where estado = 'resuelto')            as casos_resueltos,
    (select count(*) from public.apadrinamientos where estado in ('activo','completado')) as apadrinamientos;

grant select on public.v_profesionales, public.v_voluntarios, public.v_casos,
                public.v_puntos_ayuda, public.v_estadisticas
  to anon, authenticated;

-- =====================================================================
--  VALIDACIÓN DE CORREO PARA APADRINAR
--  Permite al sitio confirmar si un correo corresponde a un profesional
--  o voluntario ya aprobado, sin exponer la lista de correos.
-- =====================================================================
create or replace function public.verificar_registro(p_email text)
returns table (registrado boolean, perfil text, nombre text, profesion text)
language sql
stable
security definer
set search_path = public
as $$
  select true, 'profesional', p.nombre, p.profesion
  from public.profesionales p
  where lower(p.email) = lower(p_email) and p.estado = 'aprobado'
  union all
  select true, 'voluntario', v.nombre, v.oficio
  from public.voluntarios v
  where lower(v.email) = lower(p_email) and v.estado = 'aprobado'
  limit 1;
$$;

grant execute on function public.verificar_registro(text) to anon, authenticated;

-- =====================================================================
--  REGISTRO DE CASOS
--  El público no puede leer la tabla "casos", así que la inserción se
--  hace por esta función, que devuelve únicamente el código asignado
--  para que la familia lo conserve.
-- =====================================================================
create or replace function public.registrar_caso(datos jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  nuevo_codigo text;
begin
  if coalesce((datos ->> 'autoriza_datos')::boolean, false) is not true then
    raise exception 'Se requiere la autorización de tratamiento de datos personales.';
  end if;

  if coalesce(length(trim(datos ->> 'historia')), 0) < 20
     or coalesce(length(trim(datos ->> 'titulo')), 0) < 5 then
    raise exception 'El caso está incompleto.';
  end if;

  insert into public.casos (
    nombre_contacto, parentesco,
    personas_hogar, ninos, adultos_mayores, personas_discapacidad,
    telefono, email, direccion,
    departamento, municipio, barrio,
    titulo, historia, estado_vivienda, tenencia, urgencia,
    necesidades, fotos, autoriza_datos, autoriza_fotos, estado
  ) values (
    datos ->> 'nombre_contacto',
    nullif(datos ->> 'parentesco', ''),
    nullif(datos ->> 'personas_hogar', '')::int,
    coalesce(nullif(datos ->> 'ninos', '')::int, 0),
    coalesce(nullif(datos ->> 'adultos_mayores', '')::int, 0),
    coalesce(nullif(datos ->> 'personas_discapacidad', '')::int, 0),
    datos ->> 'telefono',
    nullif(datos ->> 'email', ''),
    nullif(datos ->> 'direccion', ''),
    datos ->> 'departamento',
    datos ->> 'municipio',
    nullif(datos ->> 'barrio', ''),
    datos ->> 'titulo',
    datos ->> 'historia',
    nullif(datos ->> 'estado_vivienda', ''),
    nullif(datos ->> 'tenencia', ''),
    coalesce(nullif(datos ->> 'urgencia', ''), 'media'),
    coalesce(
      (select array_agg(v) from jsonb_array_elements_text(coalesce(datos -> 'necesidades', '[]'::jsonb)) as t(v)),
      '{}'::text[]),
    coalesce(datos -> 'fotos', '[]'::jsonb),
    true,
    coalesce((datos ->> 'autoriza_fotos')::boolean, false),
    'pendiente'
  )
  returning codigo into nuevo_codigo;

  return nuevo_codigo;
end;
$$;

grant execute on function public.registrar_caso(jsonb) to anon, authenticated;

-- =====================================================================
--  ALMACENAMIENTO DE FOTOS
--  Crea el bucket público 'casos' para las imágenes de las viviendas.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('casos', 'casos', true)
on conflict (id) do nothing;

drop policy if exists "subir fotos de casos"      on storage.objects;
drop policy if exists "ver fotos de casos"        on storage.objects;
drop policy if exists "admin borra fotos de casos" on storage.objects;

create policy "subir fotos de casos"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'casos');

create policy "ver fotos de casos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'casos');

create policy "admin borra fotos de casos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'casos' and public.es_admin());

-- =====================================================================
--  FIN
-- =====================================================================
