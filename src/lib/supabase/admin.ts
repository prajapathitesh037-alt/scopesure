import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

export function createAdminClient() {
  const env = getEnv();
  const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseServiceKey = env.SUPABASE_SECRET_KEY || 'placeholder-service-key';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
