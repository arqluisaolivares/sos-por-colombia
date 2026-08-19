-- =====================================================================
--  SOS POR COLOMBIA · Consulta del caso por parte de la familia
--  Ejecútelo DESPUÉS de 01, 02 y 03.
--
--  Permite que una familia consulte su propio caso escribiendo el código
--  (SOS-1234) y los últimos cuatro dígitos de su WhatsApp. Sin los dos
--  datos no devuelve nada, así que nadie puede espiar casos ajenos.
-- =====================================================================

create or replace function public.consultar_caso(p_codigo text, p_telefono text)
returns table (
  codigo          text,
  estado          text,
  titulo          text,
  creado_en       timestamptz,
  municipio       text,
  departamento    text,
  urgencia        text,
  necesidades     text[],
  padrinos        jsonb,
  nota_moderacion text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.codigo, c.estado, c.titulo, c.creado_en,
    c.municipio, c.departamento, c.urgencia, c.necesidades,
    coalesce((
      select jsonb_agg(jsonb_build_object(
               'nombre',     a.nombre,
               'perfil',     a.perfil,
               'profesion',  a.profesion,
               'telefono',   a.telefono,
               'compromiso', a.compromiso,
               'plazo',      a.plazo,
               'estado',     a.estado)
             order by a.creado_en)
      from public.apadrinamientos a
      where a.caso_id = c.id and a.estado in ('activo', 'completado')
    ), '[]'::jsonb) as padrinos,
    c.nota_moderacion
  from public.casos c
  where upper(trim(c.codigo)) = upper(trim(p_codigo))
    and length(regexp_replace(coalesce(p_telefono, ''), '\D', '', 'g')) >= 4
    and right(regexp_replace(c.telefono, '\D', '', 'g'), 4)
      = right(regexp_replace(p_telefono, '\D', '', 'g'), 4)
  limit 1;
$$;

grant execute on function public.consultar_caso(text, text) to anon, authenticated;

-- =====================================================================
--  FIN
-- =====================================================================
