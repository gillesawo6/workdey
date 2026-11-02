import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig, isSupabaseConfigured } from './config';

/**
 * Creates a Supabase client for client-side React components.
 * Returns null if Supabase credentials are not configured.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createBrowserClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!
  );
}
