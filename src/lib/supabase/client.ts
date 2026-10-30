import { createBrowserClient } from '@supabase/ssr';
import { getEnv } from '@/lib/env';

export function createClient() {
  const env = getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseKey);
}
