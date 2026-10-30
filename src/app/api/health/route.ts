import { NextResponse } from 'next/server';
import { getEnv, validateRequiredServerEnv } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const env = getEnv();
  const envCheck = validateRequiredServerEnv();

  let dbStatus = 'unconfigured';
  if (env.SUPABASE_URL && env.SUPABASE_SECRET_KEY) {
    try {
      const admin = createAdminClient();
      const { error } = await admin.from('projects').select('id').limit(1);
      dbStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e: any) {
      dbStatus = `unreachable: ${e.message}`;
    }
  }

  const aiStatus = env.NEBIUS_API_KEY ? 'configured' : 'missing_api_key';

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: dbStatus,
      ai_engine: {
        provider: 'NVIDIA Nemotron via Nebius Token Factory',
        status: aiStatus,
        model: env.NEBIUS_MODEL,
        endpoint: env.NEBIUS_BASE_URL,
      },
    },
    env_valid: envCheck.isValid,
    missing_env_keys: envCheck.missing,
  });
}
