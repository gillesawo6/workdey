/**
 * Supabase Environment Configuration & Readiness Checker
 * Brand: WorkDey
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    supabaseConfig.url.startsWith('https://') &&
    !supabaseConfig.url.includes('your-project') &&
    !supabaseConfig.anonKey.includes('your-anon')
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() &&
    supabaseConfig.serviceRoleKey &&
    !supabaseConfig.serviceRoleKey.includes('your-service-role')
  );
}
