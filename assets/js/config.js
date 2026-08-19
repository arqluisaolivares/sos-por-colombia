/* =====================================================================
   SOS POR COLOMBIA · Configuración
   ---------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE USTED NECESITA EDITAR.

   1. Cree un proyecto gratuito en https://supabase.com
   2. Vaya a  Project Settings  ->  API
   3. Copie "Project URL" y "anon public" y péguelos abajo.

   Mientras estos campos estén vacíos, el sitio funciona en MODO DEMO:
   se ve completo y navegable con datos de ejemplo, pero nada se guarda.
   ===================================================================== */

export const CONFIG = {
  SUPABASE_URL: '',            // ej. 'https://abcdefgh.supabase.co'
  SUPABASE_ANON_KEY: '',       // la llave pública "anon"

  // ---- Identidad de la plataforma -----------------------------------
  ORGANIZACION: 'Fundación Profesionales Amigos',
  SITIO: 'SOS por Colombia',
  CORREO_CONTACTO: 'arqluisaolivares@gmail.com',
  WHATSAPP: '',                // ej. '573001112233' (sin + ni espacios)

  // ---- Contexto del evento ------------------------------------------
  EVENTO: 'Sismo de magnitud 7,4 del 10 de agosto de 2026',

  // ---- Comportamiento ------------------------------------------------
  MAX_FOTOS: 6,
  MAX_MB_FOTO: 5
};

/** true cuando todavía no se ha conectado la base de datos. */
export const MODO_DEMO = !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY;
