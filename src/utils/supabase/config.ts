export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Strip trailing slashes or accidentally included /rest/v1 paths
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  );
}

