-- =====================================================================
--  SOS POR COLOMBIA · Registro de avisos por WhatsApp
--  Ejecútelo DESPUÉS de 01_esquema.sql y 02_datos_iniciales.sql
--
--  Guarda la fecha en que se avisó a cada parte, para que el equipo sepa
--  qué familias ya fueron contactadas y no se repitan mensajes.
-- =====================================================================

alter table public.casos
  add column if not exists avisado_en timestamptz;

alter table public.profesionales
  add column if not exists avisado_en timestamptz;

alter table public.voluntarios
  add column if not exists avisado_en timestamptz;

alter table public.apadrinamientos
  add column if not exists aviso_familia_en      timestamptz,
  add column if not exists aviso_profesional_en  timestamptz;

-- =====================================================================
--  Vistas públicas del TABLERO
--  Solo cifras agregadas: ni un dato personal sale por aquí.
-- =====================================================================

create or replace view public.v_tablero_departamentos as
  select departamento,
         count(*)                                                    as casos,
         count(*) filter (where estado = 'resuelto')                  as resueltos,
         coalesce(sum(personas_hogar), 0)                             as personas,
         coalesce(sum(ninos), 0)                                      as ninos
  from public.casos
  where estado in ('aprobado', 'resuelto')
  group by departamento
  order by casos desc;

create or replace view public.v_tablero_necesidades as
  select n as necesidad, count(*) as casos
  from public.casos c, unnest(c.necesidades) as n
  where c.estado in ('aprobado', 'resuelto')
  group by n
  order by casos desc;

create or replace view public.v_tablero_avance as
  select
    count(*) filter (where c.estado = 'aprobado' and p.n is null)  as sin_padrino,
    count(*) filter (where c.estado = 'aprobado' and p.n > 0)      as apadrinados,
    count(*) filter (where c.estado = 'resuelto')                  as resueltos,
    coalesce(sum(c.personas_hogar), 0)                             as personas,
    coalesce(sum(c.ninos), 0)                                      as ninos
  from public.casos c
  left join lateral (
    select count(*) as n from public.apadrinamientos a
    where a.caso_id = c.id and a.estado in ('activo','completado')
  ) p on true
  where c.estado in ('aprobado', 'resuelto');

grant select on public.v_tablero_departamentos,
                public.v_tablero_necesidades,
                public.v_tablero_avance
  to anon, authenticated;

-- =====================================================================
--  FIN
-- =====================================================================
