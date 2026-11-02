import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { supabaseConfig, isSupabaseAdminConfigured } from './config';

/**
 * Creates an elevated Supabase client with the Service Role Key.
 * MUST ONLY be called in secure server-side environments (e.g., admin API routes).
 * NEVER expose this or import this in client-side code!
 */
export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createSupabaseAdmin(
    supabaseConfig.url!,
    supabaseConfig.serviceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
